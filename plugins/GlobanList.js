var plugin = {
    author: 'Zwambro',
    version: 1.0,
    name: 'Share ban list between clans',

    // Contact me on discord Zwambro#8854 to create a token for you
    zwambroapi: "",

    // Past you discord webhook here
    webhook: "",

    // Enable or disable the plugin
    enabled: true,

    manager: null,
    logger: null,

    onBan: function (data) {
        var onBanOutput = false;
        try {
            var client = new System.Net.Http.HttpClient();
            client.DefaultRequestHeaders.add("Authorization", "Token " + this.zwambroapi);
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
        try {
            var client1 = new System.Net.Http.HttpClient();
            client1.DefaultRequestHeaders.add("Authorization", "Token " + this.zwambroapi);
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

                if (!getGame === this.getGameName(server)) {
                    return;
                }
                embed = {
                    "timestamp": new Date(),
                    "color": 0,
                    "author": {
                        "name": this.getGameName(server),
                        "url": "https://zwambro.pw",
                        "icon_url": this.getGameUrl(server).toString()
                    },
                    "fields": [{
                        "name": "\u200b",
                        "value": "Suspicious player joined **" + server.Hostname.replace(/\^[0-9:;c]/g, "") + "**\n\n**Player Name:**\n==> [`" + gameEvent.Origin.CleanedName + "`](" + this.getBasUrl() + "client/profileasync/" + gameEvent.Origin.ClientId + ")\n\n**Previously Banned on:**\n==>" + getServer + "\n\n**Reason of Ban:**\n==>" + getReason,
                        "inline": false
                    }]
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
            client2.DefaultRequestHeaders.add("Authorization", "Token " + this.zwambroapi);
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
            var result1 = client1.PostAsync(this.webhook, new System.Net.Http.StringContent(JSON.stringify(params), System.Text.Encoding.UTF8, "application/json")).Result;
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
        } else if (server.eventParser.Name === "Plutonium T4 Parser") {
            game = "PlutoT4";
        } else if (server.eventParser.Name === "RektT5m Parser") {
            game = "RektT5M";
        } else if (server.eventParser.Name === "Plutonium T6 Parser") {
            game = "PlutoT6";
        } else if (server.eventParser.Name === "Black Ops 3 Parser") {
            game = "Call of Duty: Black Ops III";
        } else if (server.eventParser.Name === "S1x Parser") {
            game = "SHG1";
        }
        return game;
    },

    getGameUrl: function (server) {
        var iconUrl = "";
        if (server.eventParser.Name === "CoD4x Parser") {
            iconUrl = "http://orig05.deviantart.net/8749/f/2008/055/0/c/call_of_duty_4__dock_icon_by_watts240.png";
        } else if (server.eventParser.Name === "IW4x Parser") {
            iconUrl = "https://i.gyazo.com/758b6933287392106bfdddc24b09d502.png";
        } else if (server.eventParser.Name === "Tekno MW3 Parser") {
            iconUrl = "https://orig00.deviantart.net/9af1/f/2011/310/2/1/modern_warfare_3_logo_by_wifsimster-d4f9ozd.png";
        } else if (server.eventParser.Name === "Plutonium IW5 Parser") {
            iconUrl = "https://orig00.deviantart.net/9af1/f/2011/310/2/1/modern_warfare_3_logo_by_wifsimster-d4f9ozd.png";
        } else if (server.eventParser.Name === "IW6x Parser") {
            iconUrl = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/26fef988-18ad-48d8-a2a7-863b56ff376f/d7ccksp-ef2e9553-f841-4d0b-b84a-d32acfec22d3.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI2ZmVmOTg4LTE4YWQtNDhkOC1hMmE3LTg2M2I1NmZmMzc2ZlwvZDdjY2tzcC1lZjJlOTU1My1mODQxLTRkMGItYjg0YS1kMzJhY2ZlYzIyZDMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.RH0ORneDCfkwCQZlCxEfywboloy4j_8b7ABfA_3l5nQ";
        } else if (server.eventParser.Name === "Plutonium T4 Parser") {
            iconUrl = "https://aux3.iconspalace.com/uploads/673716477224553414.png";
        } else if (server.eventParser.Name === "RektT5m Parser") {
            iconUrl = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/8678cecb-9a26-4eba-91ba-a768c9e7ebf0/d9gfn65-39ecb111-e20e-4d48-8b00-825d40f19698.png";
        } else if (server.eventParser.Name === "Plutonium T6 Parser") {
            iconUrl = "https://i.pinimg.com/originals/5a/44/5c/5a445c5c733c698b32732550ec797e91.jpg";
        } else if (server.eventParser.Name === "Black Ops 3 Parser") {
            iconUrl = "https://cdn.imgbin.com/8/11/19/imgbin-call-of-duty-advanced-warfare-call-of-duty-united-offensive-call-of-duty-black-ops-call-of-duty-modern-warfare-2-call-of-duty-modern-warfare-3-others-SvSR3WX8D3DjpHw2Pv7uwZ8e1.jpg";
        } else if (server.eventParser.Name === "S1x Parser") {
            iconUrl = "https://img.utdstc.com/icon/245/d52/245d52392811b3ed9f0a0dadb463a94cb5069811867551476e94d3efeec08f4b:200";
        }
        return iconUrl;
    },
    onEventAsync: function (gameEvent, server) {

        if (!this.enabled) {
            return;
        }
        if (gameEvent.Type === 108) {
            var data = {
                "game": this.getGameName(server),
                "server": server.Hostname.replace(/\^[0-9:;c]/g, "").toString(),
                "adminname": gameEvent.Origin.CleanedName.toString(),
                "hackername": gameEvent.Target.CleanedName.toString(),
                "guid": gameEvent.Target.NetworkId.toString(),
                "ip": gameEvent.Target.IPAddressString.toString(),
                "reason": gameEvent.Data.replace(/\^[0-9:;c]/g, "").toString(),
                "bantype": "Permban",
                "gameid": '@' + gameEvent.Target.ClientId.toString()
            };
            this.onBan(data);
        }
        if (gameEvent.Type === 4) {
            this.onConnect(gameEvent, server);

        }
        if (gameEvent.Type === 109) {
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
    },

    onUnloadAsync: function () {},

    onTickAsync: function (server) {}
};