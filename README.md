#  Real Estate Listing Platform (HomeFinder)

## Backend for listing and saving real estate properties. 

## Main Features: 
- Agent/user roles 
- Property listings by agents 
- Users browse/save listings 

## Schemas: 
1. User info + role 
2. Property title, price, location, agent 
3. SavedProperty user, property 

## Endpoints: 
- POST /auth/register 
- POST /auth/login 
- POST /properties (agent) 
- GET /properties 
- GET /properties/:id 
- POST /saved 
- GET /saved 


## Milestone 1: Roles & Property Listings

> ### 1. Setup user roles: agent and regular user.

> ### 2. Agents can add new property listings.

> ### 3. Define schemas: User, Property.


## Milestone 2: Browsing & Saving Properties

> ### 1. Users can view all listings or a specific one.

> ### 2. Create SavedProperty schema and endpoint.

> ### 3. Allow users to save/unsave properties.


## Milestone 3: Data Fetching & Permissions

> ### 1. GET saved listings for a user.

> ### 2. Enforce permissions: only agents can create.

> ### 3. Add property filters (optional).
