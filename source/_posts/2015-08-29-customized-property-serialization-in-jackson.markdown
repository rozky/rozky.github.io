---
layout: post
title: "Customized property serialization in Jackson"
date: 2015-08-29 12:26:00 +0100
comments: true
published: true
categories: jackson java json
---
Recently I have faced a problem where I was asked to stop serializing selected object's properties into JSON 
(to protect sensible information from being logged in json style logs). Code was using Jackson library which has 
lovely `@JsonIgnore` annotation specially designed for this type of problems. It almost looked too easy 
but luckily it was bit more complicated and had a change to learn more about Jackson internals.

Issue was that the object was used as a rest api request so I couldn't just ignore a field as it will invalidate 
the request. At the same time it was being logged into the application log in the json format (json is easier to 
feed to Logstash) and we didn't wanted the field to be logged as it contains information not suitable for logging.

During a search for a solution I had stumble upon `@JsonView` which looked promising but unfortunately it wasn't 
working as it works as inclusion(you tell it which property you want) but I needed exclusion(you tell it which property
you don't want).

At the I was forced to extend a few Jackson classes and configure a mapper to use them. 

Firstly I had to to create a custom property writer which gave me full control over property serialization so I could 
replace real property value with '*'.

``` java
public class SensitivePropertyWriter extends BeanPropertyWriter {
    private final BeanPropertyWriter writer;

    public SensitivePropertyWriter(BeanPropertyWriter writer) {
        super(writer);
        this.writer = writer;
    }

    @Override
    public void serializeAsField(Object bean,
                                 JsonGenerator gen,
                                 SerializerProvider prov) throws Exception {
        Object value = writer.get(bean);
        if (value != null && value instanceof String) {
            String strValue = (String) value;
            gen.writeStringField(writer.getName(), StringUtils.repeat("*", strValue.length()));
        }
    }

    @Override
    public BeanPropertyWriter withSerializer(JsonSerializer<Object> ser) {
        return this;
    }
}
```

The next step was to write a custom bean modifier in which I could configure custom property write on property by property
base. I have just used regexp to match potentially sensitive fields but you can always go a step further and create 
an annotation.

``` java
import org.codehaus.jackson.map.SerializationConfig;
import org.codehaus.jackson.map.introspect.BasicBeanDescription;
import org.codehaus.jackson.map.ser.BeanPropertyWriter;
import org.codehaus.jackson.map.ser.BeanSerializerModifier;

import java.util.List;
import java.util.regex.Pattern;

public class SensitivePropertySerializerModifier extends BeanSerializerModifier {
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("(?i)password");

    @Override
    public List<BeanPropertyWriter> changeProperties(SerializationConfig config,
                                                     BasicBeanDescription beanDesc,
                                                     List<BeanPropertyWriter> beanProperties) {
        for (int i = 0; i < beanProperties.size(); i++) {
            BeanPropertyWriter writer = beanProperties.get(i);
            if (PASSWORD_PATTERN.matcher(writer.getName()).find()) {
                beanProperties.set(i, new SensitivePropertyWriter(writer));
            }
        }
        return beanProperties;
    }
}
```

The last step was to configure ObjectMapper to use our new serializer modifier and test it.
``` java
import org.codehaus.jackson.map.ObjectMapper;
import org.codehaus.jackson.map.SerializationConfig;
import org.codehaus.jackson.map.SerializerFactory;
import org.codehaus.jackson.map.ser.BeanSerializerFactory;
import org.junit.Test;

import java.io.IOException;

import static org.fest.assertions.api.Assertions.assertThat;

public class SensitivePropertySerializerModifierTest {
    private ObjectMapper mapper = createMapper();

    public ObjectMapper createMapper() {
        SensitivePropertySerializerModifier modifier = new SensitivePropertySerializerModifier();
        SerializerFactory sf = BeanSerializerFactory.instance.withSerializerModifier(modifier);

        ObjectMapper mapper = new ObjectMapper();
        mapper.setSerializerFactory(sf);

        return mapper;
    }

    @Test
    public void shouldMaskPasswordFields() throws IOException {
        // given
        mapper.enable(SerializationConfig.Feature.SORT_PROPERTIES_ALPHABETICALLY);

        // when
        String json = mapper.writeValueAsString(new TestObject("password123"));

        // then
        assertThat(json).isEqualTo("{\"password\":\"***********\"}");
    }

    public static class TestObject {
        private String password;

        public TestObject() {
        }

        public TestObject(String password) {
            this.password = password;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
```