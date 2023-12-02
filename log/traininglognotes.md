# Database structure

Two total tables. One for each log entry called runs which contains the fields below

From our current database of random json files,
we have the following fields:

- avg-pace
- volume-distance
- total-time
- title
- splits
- type
- elevation
- results-link
- description
- total-distance
- volume-time
- workout-type

Splits is being replaced by the workoutID, and it will refer
to data in another table which contains all split information

## Tables:

### runs

runID  |title  |date   |elevation | total-distance |total-time |avg-pace   |type       |description|volume-time|volume-distance|results-link   |workoutID  |workout-type    |user
-------|-------|-------|----------|----------------|-----------|-----------|-----------|-----------|-----------|---------------|---------------|-----------|---|---
PK int |string |date   |int (feet)| float (miles)  |int (sec)  |int (sec)  |string     |longString |int (sec)  |float (meters) |string         |int        |string |ForeignKey (int)


### splits

splitID|workoutID  |units      |specifier     | value          
-------|-----------|-----------|--------------|----------------
PK int |int        |foreginkey |float (meters)| float (sec/meters)    
1      |1          |m          |400           | 72.0           
2      |1          |m          |400           | 71.8           
3      |1          |m          |400           | 72.1           
4      |1          |m          |400           | 72.0           
5      |2          |mi         |1             | 298.1          
6      |2          |mi         |1             | 296.1          
7      |2          |m          |800           | 148.0          
8      |2          |m          |800           | 146.4          
9      |3          |s          |60            | 370            
10     |3          |s          |60            | 372            
11     |3          |s          |60            | 371            


Once I have both of these tables in the backend, I should
be able to hold all the information necessary to migrate
to the database instead of the Netlify hosting solution.

The goal is to use a django-postgres backend and make a 
REST API which can provide the information necessary to
make it all work.

This git repository is used for the frontend and I will
have another git repository which I will use for the backend.