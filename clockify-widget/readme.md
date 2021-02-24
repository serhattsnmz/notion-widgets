# Clockify Widget

## Query String Parameters:

| Parameter     | Type      | Required  | Default   | Explanation           | Example           |
| ---           | ----      | --------- | --------- | -------------         | -------           |
| api-key       | string    | required  |           | Api key of account    | api-key=xxx       |
| workspace-id  | string    | required  |           | Workspace ID          | workspcace-id=xxx |
| week-count    | int       | optional  | 5         | How many week to show | week-count=5      |
| work-limit    | string    | optional  |           | Set min work limit    | work-limit=20:00:00 |
| font-size     | string    | optional  | 16px      | Table font size       | font-size=20px    |
| dark-mode     | bool      | optional  | false     | Change dark mode      | dark-mode=true    |
| border        | bool      | optional  | true      | Change bordered mode  | border=false      |

## Api Key

Clockify API Key can be found on "Profile Settings > API > Api Key" section.

## Workspace ID

To get workspace id, go to `SETTINGS` page of workspace and workspace id will be shown on URL section of your browser. Example :

```
https://clockify.me/workspaces/<workspace-id>/settings#settings
```

## Work Limit:

If you set work limit, color of week total time will change;

- Red, if week total time is less than work limit;
- Green, if week total time is greater than work limit

Work limit format must be like "HH:mm:ss", for example "20:00:00" is 20hrs.