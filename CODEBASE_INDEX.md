# BankApp Codebase Index

## Overview

BankApp is a RESTful banking application built with Spring Boot that provides core banking operations through a REST API. The application simulates fundamental banking services including customer management, account operations, and financial transactions.

## Technical Stack

- **Framework**: Spring Boot 2.1.4 with Java 8
- **Database**: H2 in-memory database (development/testing)
- **Security**: Spring Security for authentication and authorization
- **API Documentation**: Swagger 2.9.2 (Springfox)
- **Build Tool**: Maven
- **Port**: 8989 (default)

## Project Structure

```
BankApp/
├── src/
│   ├── main/
│   │   ├── java/com/coding/exercise/bankapp/
│   │   │   ├── BankingApplication.java          # Application entry point
│   │   │   ├── config/                          # Configuration classes
│   │   │   │   ├── ApplicationConfig.java       # Swagger configuration
│   │   │   │   └── SecurityConfig.java          # Security rules
│   │   │   ├── controller/                      # REST API endpoints
│   │   │   │   ├── CustomerController.java      # Customer CRUD operations
│   │   │   │   └── AccountController.java       # Account & transaction operations
│   │   │   ├── service/                         # Business logic layer
│   │   │   │   └── BankingService.java          # Core service interface
│   │   │   ├── repository/                      # Data access layer
│   │   │   │   ├── CustomerRepository.java      # Customer data operations
│   │   │   │   ├── AccountRepository.java       # Account data operations
│   │   │   │   ├── TransactionRepository.java   # Transaction data operations
│   │   │   │   └── CustomerAccountXRefRepository.java
│   │   │   ├── model/                           # JPA entities (database)
│   │   │   │   ├── Customer.java                # Customer entity
│   │   │   │   ├── Account.java                 # Account entity
│   │   │   │   ├── Transaction.java             # Transaction entity
│   │   │   │   ├── Address.java                 # Address entity
│   │   │   │   ├── Contact.java                 # Contact entity
│   │   │   │   ├── BankInfo.java                # Bank branch entity
│   │   │   │   └── CustomerAccountXRef.java     # Customer-account link
│   │   │   └── domain/                          # DTOs (data transfer)
│   │   │       ├── CustomerDetails.java         # Customer DTO
│   │   │       ├── AccountInformation.java      # Account DTO
│   │   │       ├── TransactionDetails.java      # Transaction DTO
│   │   │       ├── TransferDetails.java         # Transfer request DTO
│   │   │       ├── AddressDetails.java          # Address DTO
│   │   │       ├── ContactDetails.java          # Contact DTO
│   │   │       └── BankInformation.java         # Bank branch DTO
│   │   └── resources/
│   │       └── application.yml                   # Application configuration
│   └── test/
│       ├── java/                                 # Unit tests
│       └── resources/                            # Sample API requests
├── pom.xml                                       # Maven dependencies
├── README.md                                     # Project documentation
├── mvnw / mvnw.cmd                              # Maven wrapper scripts
└── .gitignore                                    # Git ignore rules
```

## Architectural Layers

The application follows a standard layered architecture:

```
REST Controllers (@RestController)    <- HTTP requests/responses
         |
Spring Security Filter Chain          <- Authentication/Authorization
         |
Service Layer (@Service)              <- Business logic
         |
Repository Layer (@Repository)        <- Data access abstraction
         |
JPA/Hibernate                         <- ORM
         |
H2 Database                           <- Data storage
```

## Core Systems

### Customer Management System
- **Controller**: `CustomerController` (`/customers`)
- **Endpoints**: `/all`, `/add`, `/{customerNumber}` (GET/PUT/DELETE)
- **Entities**: `Customer`, `Address`, `Contact`
- **DTOs**: `CustomerDetails`, `AddressDetails`, `ContactDetails`

### Account Management System
- **Controller**: `AccountController` (`/accounts`)
- **Endpoints**: `/{accountNumber}`, `/add/{customerNumber}`
- **Entities**: `Account`, `BankInfo`
- **DTOs**: `AccountInformation`, `BankInformation`

### Transaction Processing System
- **Controller**: `AccountController` (`/accounts/transfer`, `/accounts/transactions`)
- **Endpoints**: `/transfer/{customerNumber}`, `/transactions/{accountNumber}`
- **Entities**: `Transaction`
- **DTOs**: `TransactionDetails`, `TransferDetails`

## API Endpoints

### Customer Controller (`/customers`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/all` | List all customers |
| POST | `/add` | Add new customer |
| GET | `/{customerNumber}` | Get customer details |
| PUT | `/{customerNumber}` | Update customer |
| DELETE | `/{customerNumber}` | Delete customer |

### Account Controller (`/accounts`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/{accountNumber}` | Get account details |
| POST | `/add/{customerNumber}` | Create new account |
| PUT | `/transfer/{customerNumber}` | Transfer funds |
| GET | `/transactions/{accountNumber}` | Get transaction history |

## Development Workflow

1. **Build**: `mvn clean install`
2. **Run**: `mvn spring-boot:run`
3. **Access API**: http://localhost:8989/bank-api/swagger-ui.html
4. **Database Console**: http://localhost:8989/bank-api/h2-console/
   - JDBC URL: `jdbc:h2:mem:testdb`
5. **Actuator**: http://localhost:8989/bank-api/actuator/health

## Key Business Identifiers

- **customerNumber**: Business key for Customer entities (type: Long)
- **accountNumber**: Business key for Account entities (type: Long)

## Configuration Files

- **ApplicationConfig.java**: Swagger configuration with API metadata
- **SecurityConfig.java**: Spring Security rules (permits H2 console access, disables CSRF)
- **application.yml**: Application properties and server configuration
