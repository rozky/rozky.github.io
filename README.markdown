create new post
    
    rake new_post["title"]
    rake new_page[super-awesome]


check it
    
    rake generate   # Generates posts and pages into the public directory
    rake watch      # Watches source/ and sass/ for changes and regenerates
    rake preview    # Watches, and mounts a webserver at http://localhost:4000
    
deploy 

    rake generate
    rake deploy