# IW4MAdmin [![GitHub license](https://img.shields.io/github/license/RaidMax/IW4M-Admin)](https://github.com/RaidMax/IW4M-Admin/blob/2.4-pr/LICENSE) [![GitHub stars](https://img.shields.io/github/stars/RaidMax/IW4M-Admin)](https://github.com/RaidMax/IW4M-Admin/stargazers)
[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/J3J821KUJ)


# Globanlist plugin for IW4MAdmin
## Requirement
- You may need IW4MAdmin version `2021.5.15.3` or later.

## Introduction
Plugin to share banlist between clans. How it works ?
- When you ban a client, the ban will added to globanlist Database.
- When a Banned client on globanlist Database joins your servers you will receive a notifications on discord.

## Installation
1. Copy Plugin in IW4MAdmin/plugins directory
2. Restart IW4MAdmin.
3. Contact me on discord `Zwambro#8854` to create an token for your clan (You can't use this plugin without authentication token).
4. Create a discord webhook to receive informations about globanlisted players on your servers.
5. Open `IW4MAdmin/Configuration/ScriptPluginSettings.json`, you'll see something like:
  ```
  "Globanlist": {
    "Author": "Zwambro",
    "Version": 1.1,
    "DiscordWebhook": "PASTDISCORDWEBHOOKHERE",
    "ZwambroAPI": "PASTZWAMBROAPIHERE"
  },
  ```
6. Replace `PASTDISCORDWEBHOOKHERE` with your discord webhook, and replace `PASTZWAMBROAPIHERE` with your Zwambro API token, save the configs.
7. visit [Zwambro.pw](https://zwambro.pw/) to see all bans.

### Special thanks and acknowledgements
- DANGER clan for testing.
- IW4Madmin developers.
- Miltan aka WatchMiltan.
