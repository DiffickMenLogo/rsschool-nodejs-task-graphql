## Assignment: Graphql

1. U can use command `npm run start` to start the server.
2. U can use command `npm run test` to run tests.
3. - Get gql requests:  
     2.1. Get users, profiles, posts, memberTypes - 4 operations in one query.

   ### Example of request:

   #### GetUsers

   ```
   query{
      getUsers{
         id,
         firstName,
         lastName,
         email,
         subscribedToUserIds,
         profile{
            id,
            avatar,
            sex,
            birthday,
            city,
            country,
            street,
            userId,
            memberTypeId,
         },
         posts{
            id,
            title,
            text,
            userId,
         },
         memberType{
            id,
            discount,
            monthPostsLimit,
         },
         subscribedToUser{
            id,
            firstName,
            lastName,
            email,
            subscribedToUserIds,
            profile{
               id,
               avatar,
               sex,
               birthday,
               city,
               country,
               street,
               userId,
               memberTypeId,
            }
            posts{
               id,
               title,
               text,
               userId,
            }
            memberType{
               id,
               discount,
               monthPostsLimit,
            }
            subscribedToUser{
               ...
            }
            userSubscribedTo{
               ...
            }
         }
         userSubscribedTo{
            id,
            firstName,
            lastName,
            email,
            subscribedToUserIds,
            profile{
               id,
               avatar,
               sex,
               birthday,
               city,
               country,
               street,
               userId,
               memberTypeId,
            }
            posts{
               id,
               title,
               text,
               userId,
            }
            memberType{
               id,
               discount,
               monthPostsLimit,
            }
            subscribedToUser{
               ...
            }
            userSubscribedTo{
               ...
            }
         }
      }
   }
   ```

   #### GetProfiles

   ```
   query{
      getProfiles{
         id,
         avatar,
         sex,
         birthday,
         city,
         country,
         street,
         userId,
         memberTypeId,
      }
   }
   ```

   #### GetPosts

   ```
   query{
      getPosts{
         id,
         title,
         text,
         userId,
      }
   }
   ```

   #### GetMemberTypes

   ```
   query{
      getMemberTypes{
         id,
         discount,
         monthPostsLimit,
      }
   }
   ```

   2.2. Get user, profile, post, memberType by id - 4 operations in one query.

   #### GetUserById

   ```
   query{
      getUser(id:''){
         watch GetUsers...
      }
   }
   ```

   #### GetProfileById

   ```
   query{
      getProfile(id:''){
         watch GetProfiles...
      }
   }
   ```

   #### GetPostById

   ```
   query{
      getPost(id:''){
         watch GetPosts...
      }
   }
   ```

   #### GetMemberTypeById

   ```
   query{
      getMemberType(id:''){
         watch GetMemberTypes...
      }
   }
   ```

   2.3. Get users with their posts, profiles, memberTypes.

   #### Use GetUsers

   2.4. Get user by id with his posts, profile, memberType.

   #### Use GetUserById

   2.5. Get users with their `userSubscribedTo`, profile.

   #### Use GetUsers

   2.6. Get user by id with his `subscribedToUser`, posts.

   #### Use GetUserById

   2.7. Get users with their `userSubscribedTo`, `subscribedToUser` (additionally for each user in `userSubscribedTo`, `subscribedToUser` add their `userSubscribedTo`, `subscribedToUser`).

   #### Use GetUsers

   - Create gql requests:  
     2.8. Create user.

   #### createUser

   ```
   mutation{
    createUser(variables: {
        firstName : "some",
        lastName :"some1"
        email : "some2"
    }){
        firstName,
        lastName,
        email
    }
   }
   ```

   2.9. Create profile.

   #### createProfile

   ```
   mutation{
      createProfile(variables: {
         userId: "9077a205-998c-478e-ac67-38d9363c800f",
         memberTypeId: "basic",
         avatar: "some",
         sex: "man",
         birthday: 123,
         country: "BY",
         city: "some",
         street: "asdi"
      }){
         id,
         memberTypeId,
         avatar,
         country,
         city,
         street,
         sex,
      }
   }
   ```

   2.10. Create post.

   #### createPost

   ```
   mutation{
      createPost(variables: {
         userId: "bee7a1af-8821-4280-af2b-eebcec1ea040",
         title: "some",
         content: "some"
      }){
         id,
         title,
         content,
         userId,
      }
   }
   ```

   - Update gql requests:  
     2.12. Update user.

   #### updateUser

   ```
   mutation{
      updateUser(variables: {
        id: "acc9c34e-e086-4584-ab9c-bb12bdf2a47d",
         firstName: "some22",
         lastName: "some22",
         email: "some22"
      }){
         id,
         firstName,
         lastName,
         email,
      }
   }
   }
   ```

   2.13. Update profile.

   #### updateProfile

   ```
   mutation{
      updateProfile(variables: {
        id: "003751a6-b7f2-4ffd-985e-edb94b80a464",
         avatar: "some22",
        sex: "some22",
        birthday: 22,
        country: "some22",
        city: "some22",
        street: "some22",
        memberTypeId: "basic"
      }){
         id,
         avatar,
         sex,
         birthday,
         country,
         city,
         street,
         memberTypeId
      }
   }
   ```

   2.14. Update post.

   #### updatePost

   ```
   mutation{
      updatePost(variables: {
        id: "a943bf43-41d0-4853-abfe-0353862759dd",
         title: "some22",
         content: "some22",
      }){
        id,
         title,
         content,

      }
   }
   ```

   2.15. Update memberType.

   #### updateMemberType

   ```
   mutation{
      updateMemberType(variables: {
        id: "basic",
         discount: 22,
         monthPostsLimit: 22,
      }){
         id,
         discount,
         monthPostsLimit,
      }
   }
   ```

   2.16. Subscribe to; unsubscribe from.

   #### subscribeTo

   ```
   mutation{
      subscribeToUser(variables: {
        userId: "bee7a1af-8821-4280-af2b-eebcec1ea040",
        subscribedToUserId: "acc9c34e-e086-4584-ab9c-bb12bdf2a47d",
      }){
         id,
         firstName,
         lastName,
         email,
      }
   }
   ```

   #### unsubscribeFrom

   ```
      mutation{
      subscribeToUser(variables: {
        userId: "bee7a1af-8821-4280-af2b-eebcec1ea040",
        unsubscribeFromUserId: "acc9c34e-e086-4584-ab9c-bb12bdf2a47d",
      }){
         id,
         firstName,
         lastName,
         email,
      }
   }
   ```
