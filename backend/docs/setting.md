# Overview

The Settings module in Nestjs Motorbike System provides a centralized mechanism for accessing and exposing application configuration values. Instead of storing settings in a database, this implementation retrieves values from the application's configuration (via ConfigService) and formats them into structured, type-sage response objects.

This documentation explains the features and usage of:

- **Setting Module**: Located at `src/module/setting`

# Table of Contents

- [Overview](#overview)
- [Table of Contents](#table-of-contents)
  - [DTOs](#dtos)
  - [Available Settings](#available-settings)
  - [Security](#security)

## DTOs

Settings are organized into category-specific DTOs, all combined in SettingCoreResponseDto:

```typescript
export class SettingCoreResponseDto {
  name: string; // Application name
  env: ENUM_APP_ENVIRONMENT; // Current environment
  timeout: number; // Request timeout
  timeoutUnit: ENUM_SETTING_UNIT; // Unit for timeout
  file: SettingFileResponseDto; // File-related settings
  language: SettingLanguageResponseDto; // Language settings
  timezone: SettingTimezoneResponseDto; // Timezone settings
  middleware: SettingMiddlewareResponseDto; // Middleware settings
  auth: SettingAuthResponseDto; // Authentication settings
  user: SettingUserResponseDto; // User-related settings
}
```

Each category-specific DTO contains related settings. For example, the Auth settings DTO:

```typescript
export class SettingCoreResponseDto {
  name: string; // Application name
  env: ENUM_APP_ENVIRONMENT; // Current environment
  timeout: number; // Request timeout
  timeoutUnit: ENUM_SETTING_UNIT; // Unit for timeout
  file: SettingFileResponseDto; // File-related settings
  language: SettingLanguageResponseDto; // Language settings
  timezone: SettingTimezoneResponseDto; // Timezone settings
  middleware: SettingMiddlewareResponseDto; // Middleware settings
  auth: SettingAuthResponseDto; // Authentication settings
  user: SettingUserResponseDto; // User-related settings
}
```

## Available Settings

The Settings module exposes the following categories of settings:

| Category   | Description                     | Contents                                      |
| ---------- | ------------------------------- | --------------------------------------------- |
| Core       | Basic application settings      | App name, environment, timeout                |
| Auth       | Authentication-related settings | Password policies, expiration times           |
| File       | File handling settings          | Max file sizes, allowed file types            |
| Language   | Internationalization settings   | Current language, available languages         |
| Timezone   | Time and timezone settings      | Current timezone, timezone offset             |
| Middleware | Middleware configuration        | Body size limits for different content types  |
| User       | User-related settings           | Username prefix and other user configurations |

## Security

The Settings module's endpoints are protected by the `@ApiKeySystemProtected()` decorator, which ensures that only authenticated system clients with valid API keys can access the settings. This protection is crucial as settings reveal information about the appliation's configuration that should not be publicy accessible.
