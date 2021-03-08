class HelperFunctions {

    static jsonToString(jsonData) {
        // return string;
        return JSON.stringify(jsonData, null, 2)
    }

    static getFirstTimeOfDateISO(date) {
        // return string;
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}T00:00:00.000Z`;
    }

    static getLastTimeOfDateISO(date) {
        // return string;
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}T23:59:59.999Z`;
    }

    static getFirstDateOfCurrentWeek() {
        // return Date;
        var currentDay = new Date;
        var dayOfWeek = currentDay.getDay() == 0 ? 7 : currentDay.getDay();
        var firstDay = currentDay.getDate() - dayOfWeek + 1;
        var weekFirstDay = new Date(currentDay.setDate(firstDay));
        return new Date(weekFirstDay.setHours(0, 0, 0, 0));
    }

    static getLastDateOfCurrentWeek() {
        // return Date;
        var currentDay = new Date;
        var dayOfWeek = currentDay.getDay() == 0 ? 7 : currentDay.getDay();
        var lastDay = currentDay.getDate() - dayOfWeek + 7;
        var weekLastDay = new Date(currentDay.setDate(lastDay));
        return new Date(weekLastDay.setHours(23, 59, 59, 999));
    }

    static convertSecondsToTime(totalSeconds) {
        // return string;
        var hour = Math.trunc(totalSeconds / 3600);
        var minute = Math.trunc((totalSeconds % 3600) / 60);
        var seconds = totalSeconds % 60;

        return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    static addDays(date, days) {
        // return Date;
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    static formatDateForShortPrint(date) {
        // return string;
        return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}`;
    }

    static formatDateForFullPrint(date) {
        // return string;
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()} ${days[date.getDay()]}`;
    }
}

class ClockifyApi {

    constructor(apiKey, workspaceId) {
        this.apiKey = apiKey;
        this.workspaceId = workspaceId;
    }

    getUserProjects() {
        var ajaxResponse = null;
        $.ajax({
            async: false,
            url: "https://api.clockify.me/api/v1/workspaces/" + this.workspaceId + "/projects",
            type: "GET",
            headers: {
                "X-Api-Key": this.apiKey
            },
            success: function(response) {
                ajaxResponse = response;
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("Ajax error! <br />" + textStatus + "<br />" + jsonToString(errorThrown));
            }
        });

        var _response = [];

        ajaxResponse.forEach(element => {
            _response.push({
                "id": element["id"],
                "name": element["name"]
            })
        });

        return _response;
    }

    getReport(startDate, endDate) {
        var ajaxResponse = null;
        $.ajax({
            async: false,
            url: "https://reports.api.clockify.me/v1/workspaces/" + this.workspaceId + "/reports/summary",
            type: "POST",
            headers: {
                "X-Api-Key": this.apiKey,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                "dateRangeStart": startDate,
                "dateRangeEnd": endDate,
                "summaryFilter": {
                    "groups": [
                        "PROJECT",
                        "TIMEENTRY"
                    ]
                }
            }),
            success: function(response) {
                ajaxResponse = response;
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                console.log("Ajax error! <br />" + textStatus + "<br />" + jsonToString(errorThrown));
            }
        });

        var _response = {
            "totalTime": ajaxResponse["totals"][0] != null ?
                HelperFunctions.convertSecondsToTime(ajaxResponse["totals"][0]["totalTime"]) : "-",
            "projects": []
        };

        ajaxResponse["groupOne"].forEach(element => {
            _response["projects"].push({
                "id": element["_id"],
                "totalTime": HelperFunctions.convertSecondsToTime(element["duration"]),
                "name": element["name"]
            })
        });

        return _response;
    }

    getTodayTotalTime() {
        var today = new Date;
        var firstDate = HelperFunctions.getFirstTimeOfDateISO(today);
        var lastDate = HelperFunctions.getLastTimeOfDateISO(today);

        var result = this.getReport(firstDate, lastDate);

        return result["totalTime"];
    }

    getWeekTotalTime() {
        var firstDate = HelperFunctions.getFirstTimeOfDateISO(HelperFunctions.getFirstDateOfCurrentWeek());
        var lastDate = HelperFunctions.getLastTimeOfDateISO(HelperFunctions.getLastDateOfCurrentWeek());

        var result = this.getReport(firstDate, lastDate);

        return result["totalTime"];
    }
}