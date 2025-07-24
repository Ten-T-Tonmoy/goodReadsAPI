# Entities and Controllers for them

## entity: ``user`` (first seperate from authors)
 
- flow
    - create User
        - create Books
            - create lists
            - create reviews
            - make comments/votes
        
        - create articles (link up bt not direct independent)
        - timeLine?
        - a bucketPage where all added books go
            -from that u can make list 
                -list popUp to select new or existing ones
        - a profile page of several sections
        


    - create Author (indirect)
        - non active will just have a page to display 
            - will wait for admin approval for edits
        - active =>
            - same display page
            - USER features=> make list/article/comment/

- contents
  - user curd=> independent 
  - other entities will later get connected
  - endpoints total
    ```
       '/addUser' => will add user  
    ```

