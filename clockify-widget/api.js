class HelperFunctions {

    static JsonToString(jsonData) {
        return JSON.stringify(jsonData, null, 2)
    }
    
    static getFirstTimeOfDate(date){
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}T00:00:00.000Z`;
    }
    
    static getLastTimeOfDate(date){
        return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}T23:59:59.999Z`;
    }

    static GetFirstDateOfCurrentWeek() {
        var currentDay = new Date;
        var firstDay = currentDay.getDate() - currentDay.getDay() + 1;
        var weekFirstDay = new Date(currentDay.setDate(firstDay));
        return this.getFirstTimeOfDate(weekFirstDay);
    }

    static GetLastDateOfCurrentWeek() {
        var currentDay = new Date;
        var lastDay = currentDay.getDate() - currentDay.getDay() + 7;
        var weekLastDay = new Date(currentDay.setDate(lastDay));
        return this.getLastTimeOfDate(weekLastDay);
    }

    static ConvertSecondsToTime(totalSeconds) {
        var hour = Math.trunc(totalSeconds / 3600);
        var minute = Math.trunc((totalSeconds % 3600) / 60);
        var seconds = totalSeconds % 60;

        return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }

    static AddDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    static FormatDateForPrint(date) {
        return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}`;
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

    getWeeklyReport(startDate, endDate) {
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
                HelperFunctions.ConvertSecondsToTime(ajaxResponse["totals"][0]["totalTime"]) : "-",
            "projects": []
        };

        ajaxResponse["groupOne"].forEach(element => {
            _response["projects"].push({
                "id": element["_id"],
                "totalTime": HelperFunctions.ConvertSecondsToTime(element["duration"]),
                "name": element["name"]
            })
        });

        return _response;
    }

    getTodayTotalTime() {
        var today = new Date;
        var firstDate = HelperFunctions.getFirstTimeOfDate(today);
        var lastDate = HelperFunctions.getLastTimeOfDate(today);

        var result = this.getWeeklyReport(firstDate, lastDate);

        return result["totalTime"];
    }
}