/*
Copyright (c) 2021 Ouchekkir Abdelmouaine

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


const plugin = {
    author: 'Zwambro',
    version: 1.22,
    name: 'Globanlist',

    configHandler: null,
    manager: null,
    logger: null,

    onBan: function (data) {
        var onBanOutput = false;
        try {
            var client = new System.Net.Http.HttpClient();
            client.DefaultRequestHeaders.add("Authorization", "Token " + this.configHandler.GetValue("ZwambroAPI"));
            var result = client.PostAsync("https://zwambro.pw/globanlist/addban", new System.Net.Http.StringContent(JSON.stringify(data), System.Text.Encoding.UTF8, "application/json")).Result;
            var resCl = result.Content;
            var parsedJSON = JSON.parse(resCl.ReadAsStringAsync().Result);
            resCl.Dispose();
            result.Dispose();
            client.Dispose();
            onBanOutput = parsedJSON.banned
            if (onBanOutput) {
                this.logger.WriteInfo('the banned added perfectly to globanlist');
            }
        } catch (e) {
            this.logger.WriteWarning('Something Happened: ' + e.message);
        }
    },
    onConnect: function (gameEvent, server) {
        var checkJsonOutput = false;
        var getGame = "";
        var getServer = "";
        var getReason = "";
        var getBanCredibility = "";
        try {
            var client1 = new System.Net.Http.HttpClient();
            client1.DefaultRequestHeaders.add("Authorization", "Token " + this.configHandler.GetValue("ZwambroAPI"));
            var result1 = client1.GetAsync("https://zwambro.pw/globanlist/checktheban?guid=" + gameEvent.Origin.NetworkId.toString() + "&ip=" + gameEvent.Origin.IPAddressString.toString()).Result;
            var resCl1 = result1.Content;
            var toJson1 = JSON.parse(resCl1.ReadAsStringAsync().Result);
            resCl1.Dispose();
            result1.Dispose();
            client1.Dispose();
            checkJsonOutput = toJson1.banned;
            if (checkJsonOutput) {
                this.logger.WriteInfo('Found a ban entry for ' + gameEvent.Origin.CleanedName + ' in globanlist');
                getGame = toJson1.gamename;
                getServer = toJson1.hostname;
                getReason = toJson1.reason;
                getBanCredibility = toJson1.banCredibility
                if (!getGame === this.getGameName(server)) {
                    return;
                }
                embed = {
                    "timestamp": new Date(),
                    "color": 16312092,
                    "author": {
                        "name": "Globanlist",
                        "url": "https://zwambro.pw"
                    },
                    "fields": [
                        {
                            "name": "Suspicious player has joined:",
                            "value": server.Hostname.replace(/\^[0-9:;c]/g, ""),
                            "inline": false
                        },
                        {
                            "name": "Playername:",
                            "value": "[`" + gameEvent.Origin.CleanedName + "`](" + this.getBasUrl() + "client/profileasync/" + gameEvent.Origin.ClientId + ")",
                            "inline": false
                        },
                        {
                            "name": "The game in which was banned:",
                            "value": getGame,
                            "inline": false
                        },
                        {
                            "name": "The server was banned from:",
                            "value": getServer,
                            "inline": false
                        },
                        {
                            "name": "The reason of the ban:",
                            "value": getReason,
                            "inline": false
                        },
                        {
                            "name": "Ban Credibility:",
                            "value": '`' + getBanCredibility + '`',
                            "inline": false
                        },
                    ],
                }
                this.sendWebHook(embed);
            }
        } catch (e) {
            this.logger.WriteWarning('Something happened: ' + e.message);
        }
    },
    onUnban: function (data1) {
        var unbanJsonOutput = false
        try {
            var client2 = new System.Net.Http.HttpClient();
            client2.DefaultRequestHeaders.add("Authorization", "Token " + this.configHandler.GetValue("ZwambroAPI"));
            var result2 = client2.PostAsync("https://zwambro.pw/globanlist/unban", new System.Net.Http.StringContent(JSON.stringify(data1), System.Text.Encoding.UTF8, "application/json")).Result;
            var resCl2 = result2.Content;
            var toJson2 = JSON.parse(resCl2.ReadAsStringAsync().Result);
            resCl2.Dispose();
            result2.Dispose();
            client2.Dispose();
            unbanJsonOutput = toJson2.unbanned;
            if (unbanJsonOutput) {
                this.logger.WriteInfo('Unbanned perfectly from globanlist');
            }
        } catch (e) {
            this.logger.WriteWarning('Something happened: ' + e.message);
        }
    },
    sendWebHook: function (embed) {
        try {
            var params = {
                "embeds": [embed]
            }
            var client1 = new System.Net.Http.HttpClient();
            var result1 = client1.PostAsync(this.configHandler.GetValue("DiscordWebhook"), new System.Net.Http.StringContent(JSON.stringify(params), System.Text.Encoding.UTF8, "application/json")).Result;
            var resCl1 = result1.Content;
            resCl1.Dispose();
            result1.Dispose();
            client1.Dispose();
        } catch (e) {
            this.logger.WriteWarning('There was a problem sending this webhook: ' + e.message);
        }
    },
    getBasUrl: function () {
        var basURL = this.manager.GetApplicationSettings().Configuration().WebfrontUrl;

        if ((!basURL.endsWith("/"))) {
            basURL += "/";
        }
        return basURL;
    },
    getGameName: function (server) {
        var game = "";
        if (server.eventParser.Name === "CoD4x Parser") {
            game = "CoD4x";
        } else if (server.eventParser.Name === "IW4x Parser") {
            game = "IW4x";
        } else if (server.eventParser.Name === "Tekno MW3 Parser") {
            game = "TeknoMW3";
        } else if (server.eventParser.Name === "Plutonium IW5 Parser") {
            game = "PlutoIW5";
        } else if (server.eventParser.Name === "IW6x Parser") {
            game = "IW6x";
        } else if (server.eventParser.Name === "Plutonium T4 MP Parser") {
            game = "PlutoT4";
        } else if (server.eventParser.Name === "Plutonium T4 CO-OP/Zombies Parser") {
            game = "PlutoT4 Zombies";
        } else if (server.eventParser.Name === "RektT5m Parser") {
            game = "RektT5M";
        } else if (server.eventParser.Name === "Plutonium T6 Parser") {
            game = "PlutoT6";
        } else if (server.eventParser.Name === "Black Ops 3 Parser") {
            game = "Call of Duty: Black Ops 3";
        } else if (server.eventParser.Name === "S1x Parser") {
            game = "SHG1";
        } else if (server.eventParser.Name === "CS:GO Parser") {
            game = "CSGO";
        } else if (server.eventParser.Name === "CS:GO (SourceMod) Parser") {
            game = "CSGO (SourceMod)";
        }else{
            game = "Not Supported Game";
        }
        return game;
    },
    onEventAsync: function (gameEvent, server) {

        if (gameEvent.TypeName === 'Ban') {
            var data = {
                "game": this.getGameName(server),
                "server": server.Hostname.replace(/\^[0-9:;c]/g, "").toString(),
                "adminname": gameEvent.Origin.CleanedName.toString(),
                "hackername": gameEvent.Target.CleanedName.toString(),
                "guid": gameEvent.Target.NetworkId.toString(),
                "ip": gameEvent.Target.IPAddressString.toString(),
                "reason": gameEvent.Data.replace(/\^[0-9:;c]/g, "").toString(),
                "gameid": '@' + gameEvent.Target.ClientId.toString()
            };
            this.onBan(data);
        }
        if (gameEvent.TypeName === "Join") {
            this.onConnect(gameEvent, server);

        }
        if (gameEvent.TypeName === "Unban") {
            var data1 = {
                "guid": gameEvent.Target.NetworkId.toString(),
                "ip": gameEvent.Target.IPAddressString.toString()
            };

            this.onUnban(data1);
        }
    },
    onLoadAsync: function (manager) {
        this.manager = manager;
        this.logger = manager.GetLogger(0);
        this.configHandler = _configHandler;

        this.configHandler.SetValue("Author", this.author);
        this.configHandler.SetValue("Version", this.version);

        var webHook = this.configHandler.GetValue("DiscordWebhook");
        var zwambroApi = this.configHandler.GetValue("ZwambroAPI");

        if (webHook !== undefined) {
            this.configHandler.SetValue("DiscordWebhook", "PAST_DISCORD_WEBHOOK_HERE");
        }
        if (zwambroApi !== undefined) {
            this.configHandler.SetValue("ZwambroAPI", "PAST_ZWAMBRO_API_HERE");
        }
    },

    onUnloadAsync: function () {},

    onTickAsync: function (server) {}
};
