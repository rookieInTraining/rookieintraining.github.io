# Fetch GraphQL query from an Apollo client using APQ - Part 1

> Struggling to automate GraphQL APIs or fetch queries? Learn about APQ and how to intercept these requests in this guide to GraphQL automation.

- URL: https://ishabbi.tech/posts/debug-apq-extension-part1/
- Published: 2024-07-20
- Updated: 2026-10-26
- Tags: Graphql, Apollo-Graphql, Apq, Chrome-Extensions, Debugging, Graphql-Queries

**APIs (Application Programming Interfaces)** for web applications have evolved significantly since the early days of the internet. Initially, APIs were simple and used primarily for data exchange between server and client, often through protocols like SOAP (Simple Object Access Protocol). These early APIs were cumbersome and required extensive documentation and strict adherence to protocols.

The rise of **REST (Representational State Transfer)** in the early 2000s marked a major shift, offering a more flexible and scalable approach to building web APIs. RESTful APIs leverage standard HTTP methods, making them easier to use and more intuitive. However, 2015 saw a paradigm shift, Facebook (now Meta Inc.) introduced **GraphQL** to the world, allowing clients to request specific data, resulting to it’s rapid adoption amongst enterprises. According to reports, it is projected that by 2025, *over 50% of enterprises will use GraphQL in production, up from less than 10% in 2021*.

* * *

## Graphql 101

For those who are new to GraphQL, I’ll highlight some of the key concepts used below:

### Schema

The schema defines the structure of the API, specifying types, queries, mutations, and subscriptions. It serves as a contract between the client and server.

### Types

GraphQL uses various types such as Scalar, Object, Enum, Union, and Interface to define the shape of the data and the relationships between different data fields.

### Queries

Queries are used to fetch data from the server. They specify what data is needed and can include nested fields to retrieve related data in a single request.

### Mutations

Mutations are used to modify data on the server. They allow clients to perform actions like creating, updating, or deleting data.

### Subscriptions

Subscriptions enable real-time updates by allowing clients to listen for specific events and receive updates when those events occur.

### Resolvers

Resolvers are functions that handle the logic for fetching the data specified in queries, mutations, and subscriptions. They map schema fields to data sources.

### Fields

Fields are the individual pieces of data that can be queried within a type. Each field can have arguments, making the queries flexible and dynamic.

### Arguments

Arguments allow clients to pass parameters to fields, enabling the customization of the data fetched by queries and mutations.

### Directives

Directives provide a way to modify the behavior of queries, such as including or skipping fields based on conditions (@include and @skip).

### Fragments

Fragments allow the reuse of parts of queries and mutations. They help in structuring queries and reducing redundancy by defining reusable units of selection sets.

### Introspection

Introspection is a feature that allows clients to query the schema itself to understand the types, fields, and operations available, aiding in API exploration and documentation.

For further reading, you can go through the getting started present [here](https://graphql.org/learn/)

As discussed earlier, graphql’s strengths is its ability to fetch exactly the data needed. This can however, also lead to issues if not managed correctly. Over-querying can occur if clients request too much data, impacting performance. Under-querying, where not enough data is requested, might require multiple requests to fulfill a need, which could negate some of the benefits of using GraphQL​.

Also, in order to avoid under and over-fetching, developers might resort to creating complex queries containing multiple fragments which increases the size of the payload that needs to be sent to the network which again impacts the performance of the application.

And this is where we are introduced to the ***Apollo Client***.

* * *

## Apollo Client and APQ

As per their current documentation:

> Apollo provides the developer platform and tools to unify your data and services into a supergraph—a single distributed GraphQL API. Apollo makes GraphQL work for you at any stage and any scale, whether you're just getting started, building your first API, querying an API, or migrating your platform onto the supergraph.

Apollo GraphQL Client provides several features that help overcome the limitations of GraphQL, enhancing the development experience and performance of GraphQL-based applications. The discussion for which is limited to **Automatic persisted queries or APQ**

> A persisted query is a query string that's cached on the server side, along with its unique identifier (always its SHA-256 hash). Clients can send this identifier instead of the corresponding query string, thus reducing request sizes dramatically (response sizes are unaffected).
> 
> To persist a query string, Apollo Server must first receive it from a requesting client. Consequently, each unique query string must be sent to Apollo Server at least once. After any client sends a query string to persist, every client that executes that query can then benefit from APQ.

Now, this works wonders in boosting the performance of the application. But, does pose a threat to testing teams as they are unaware of the contracts set for the cached query. For example, a graphql query in [expedia.com](https://www.expedia.com) would be something like this:

```json
[
    {
        "operationName": "NotificationsQuery",
        "variables": {
            "k1":"v1",
            "k2":"v2"
        },
        "extensions": {
            "persistedQuery": {
                "version": 1,
                "sha256Hash": "<a really long hash which you would not want on blog sites!>"
            }
        }
    }
]
```

In a situation where the schema and documentations are not shared with the testing teams, one would require to either go through the codebase to view the queries being used or each out to the developer who is the owner of that particular feature/improvement.

This can become a bottleneck for fast moving teams who are pushing features day in and day out to production *#IYKYK*. This then further prompted me to work on a utility which is the subject of this article.

The solution for which I’ll post in the [part-2](https://ishabbi.tech/posts/debug-apq-extension-part2/) of this article.

* * *
