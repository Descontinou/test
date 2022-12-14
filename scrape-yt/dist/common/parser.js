"use strict";
/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGetUpNext = exports.parseGetRelated = exports.parseGetVideo = exports.parseGetPlaylist = exports.parseSearch = void 0;
var cheerio_1 = __importDefault(require("cheerio"));
/**
 * Get duration in seconds
 *
 * @param s String timestamp
 */
var getDuration = function (s) {
    s = s.replace(/:/g, ".");
    var spl = s.split(".");
    if (spl.length === 0)
        return +spl;
    else {
        var sumStr = spl.pop();
        if (sumStr !== undefined) {
            var sum = +sumStr;
            if (spl.length === 1)
                sum += +spl[0] * 60;
            if (spl.length === 2) {
                sum += +spl[1] * 60;
                sum += +spl[0] * 3600;
            }
            return sum;
        }
        else {
            return 0;
        }
    }
};
/**
 * Scrape search result from passed HTML
 *
 * @param html HTML
 * @param options Search options
 */
function parseSearch(html, options) {
    var results = [];
    var $ = cheerio_1.default.load(html);
    $(".yt-lockup").each(function (i, v) {
        if (results.length >= options.limit)
            return false;
        var $result = $(v);
        var id = $result.find("a.yt-uix-tile-link").attr("href");
        if (id === undefined || id.startsWith("https://www.googleadservices.com"))
            return true; //Ignoring non video
        var result;
        if (options.type === "video") {
            result = {
                id: id.replace("/watch?v=", ""),
                title: $result.find(".yt-lockup-title a").text(),
                duration: getDuration($result.find(".video-time").text().trim()) || null,
                thumbnail: $result.find(".yt-thumb-simple img").attr("data-thumb") || $result.find(".yt-thumb-simple img").attr("src"),
                channel: {
                    id: $result.find(".yt-lockup-byline a").attr("href").split("/")[2],
                    name: $result.find(".yt-lockup-byline a").text() || null,
                    url: "https://www.youtube.com" + $result.find(".yt-lockup-byline a").attr("href") || null,
                },
                uploadDate: $result.find(".yt-lockup-meta-info li:first-of-type").text(),
                viewCount: +$result.find(".yt-lockup-meta-info li:last-of-type").text().replace(/[^0-9]/g, ""),
                type: "video"
            };
        }
        else if (options.type === "playlist") {
            result = {
                id: id.split("&list=")[1],
                title: $result.find(".yt-lockup-title a").text(),
                thumbnail: $result.find(".yt-thumb-simple img").attr("data-thumb") || $result.find(".yt-thumb-simple img").attr("src"),
                channel: {
                    id: $result.find(".yt-lockup-byline a").attr("href").split("/")[2],
                    name: $result.find(".yt-lockup-byline a").text() || null,
                    url: "https://www.youtube.com" + $result.find(".yt-lockup-byline a").attr("href") || null,
                },
                videoCount: +$result.find(".formatted-video-count-label b").text().replace(/[^0-9]/g, ""),
                type: "playlist"
            };
        }
        else {
            result = {
                id: id.split("/")[2],
                name: $result.find(".yt-lockup-title a").text(),
                thumbnail: "https:" + ($result.find(".yt-thumb-simple img").attr("data-thumb") || $result.find(".yt-thumb-simple img").attr("src")),
                videoCount: +$result.find(".yt-lockup-meta-info li").text().replace(/[^0-9]/g, ""),
                url: "https://www.youtube.com" + $result.find("a.yt-uix-tile-link").attr("href"),
                type: "channel"
            };
        }
        results.push(result);
    });
    //Alternative
    if (results.length === 0) {
        var dataInfo = [];
        var scrapped = false;
        // Try to decode the data if it's still encoded
        try {
            var data = html.split("ytInitialData = JSON.parse('")[1].split("');</script>")[0];
            data = data.replace(/\\x([0-9A-F]{2})/ig, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return String.fromCharCode(parseInt(args[1], 16));
            });
            html = data;
        }
        catch (err) { }
        //Trying to scrap for each possible ways of how Youtube serve the data in JS ordered by most common possibility
        try {
            dataInfo = JSON.parse(html.split("{\"itemSectionRenderer\":{\"contents\":")[html.split("{\"itemSectionRenderer\":{\"contents\":").length - 1].split(",\"continuations\":[{")[0]);
            scrapped = true;
        }
        catch (err) { }
        if (!scrapped) {
            try {
                dataInfo = JSON.parse(html.split("{\"itemSectionRenderer\":")[html.split("{\"itemSectionRenderer\":").length - 1].split("},{\"continuationItemRenderer\":{")[0]).contents;
                scrapped = true;
            }
            catch (err) { }
        }
        if (!scrapped) {
            return [];
        }
        for (var i = 0; i < dataInfo.length; i++) {
            var data = dataInfo[i];
            var result = void 0;
            var searchType = options.type;
            if (searchType === "all") {
                if (data.videoRenderer !== undefined)
                    searchType = "video";
                else if (data.playlistRenderer !== undefined)
                    searchType = "playlist";
                else if (data.channelRenderer !== undefined)
                    searchType = "channel";
                else
                    continue;
            }
            if (searchType === "video") {
                data = data.videoRenderer;
                if (!data)
                    continue;
                result = {
                    id: data.videoId,
                    title: data.title.runs[0].text,
                    duration: data.lengthText ? getDuration(data.lengthText.simpleText) : null,
                    thumbnail: data.thumbnail.thumbnails[data.thumbnail.thumbnails.length - 1].url,
                    channel: {
                        id: data.ownerText.runs[0].navigationEndpoint.browseEndpoint.browseId,
                        name: data.ownerText.runs[0].text || null,
                        url: "https://www.youtube.com" + data.ownerText.runs[0].navigationEndpoint.browseEndpoint.canonicalBaseUrl || null,
                    },
                    uploadDate: data.publishedTimeText ? data.publishedTimeText.simpleText : null,
                    viewCount: data.viewCountText && data.viewCountText.simpleText ? +data.viewCountText.simpleText.replace(/[^0-9]/g, "") : null,
                    type: "video"
                };
            }
            else if (searchType === "playlist") {
                data = data.playlistRenderer;
                if (!data)
                    continue;
                result = {
                    id: data.playlistId,
                    title: data.title.simpleText,
                    thumbnail: data.thumbnails[0].thumbnails[data.thumbnails[0].thumbnails.length - 1].url,
                    channel: {
                        id: data.shortBylineText.runs[0].navigationEndpoint.browseEndpoint.browseId,
                        name: data.shortBylineText.runs[0].text,
                        url: "https://www.youtube.com" + data.shortBylineText.runs[0].navigationEndpoint.commandMetadata.webCommandMetadata.url,
                    },
                    videoCount: +data.videoCount.replace(/[^0-9]/g, ""),
                    type: "playlist"
                };
            }
            else {
                data = data.channelRenderer;
                if (!data)
                    continue;
                result = {
                    id: data.channelId,
                    name: data.title.simpleText,
                    thumbnail: "https:" + data.thumbnail.thumbnails[data.thumbnail.thumbnails.length - 1].url,
                    videoCount: data.videoCountText ? +data.videoCountText.runs[0].text.replace(/[^0-9]/g, "") : null,
                    url: "https://www.youtube.com" + data.navigationEndpoint.browseEndpoint.canonicalBaseUrl,
                    type: "channel"
                };
            }
            if (results.length < options.limit)
                results.push(result);
            else
                break;
        }
    }
    return results;
}
exports.parseSearch = parseSearch;
/**
 * Scrape playlist result from passed HTML
 *
 * @param html HTML
 */
function parseGetPlaylist(html) {
    var _a, _b, _c, _d, _e, _f;
    var $ = cheerio_1.default.load(html);
    var playlist;
    var videos = [];
    $(".pl-video").each(function (i, v) {
        var $result = $(v);
        if ($result.find(".pl-video-owner a").attr("href") === undefined)
            return true; //Continue if deleted video
        var video = {
            id: $result.find("button").attr("data-video-ids"),
            title: $result.find("a.pl-video-title-link").text().replace(/\n/g, "").trim(),
            duration: getDuration($result.find(".timestamp").text()) || null,
            thumbnail: $result.find("img").attr("data-thumb"),
            channel: {
                id: $result.find(".pl-video-owner a").attr("href").split("/")[2],
                name: $result.find(".pl-video-owner a").text(),
                url: "https://www.youtube.com" + $result.find(".pl-video-owner a").attr("href")
            }
        };
        videos.push(video);
    });
    if (videos.length > 0) {
        playlist = __assign(__assign({ id: $("#pl-header").attr("data-full-list-id"), title: $(".pl-header-title").text().trim(), videoCount: +$(".pl-header-details li")[$(".pl-header-details li").length - 3].children[0].data.replace(/[^0-9]/g, ""), viewCount: +$(".pl-header-details li")[$(".pl-header-details li").length - 2].children[0].data.replace(/[^0-9]/g, ""), lastUpdatedAt: $(".pl-header-details li")[$(".pl-header-details li").length - 1].children[0].data }, $("#appbar-nav a").attr("href") !== undefined && {
            channel: {
                id: $("#appbar-nav a").attr("href").split("/")[2],
                name: $(".appbar-nav-avatar").attr("title"),
                thumbnail: $(".appbar-nav-avatar").attr("src"),
                url: "https://www.youtube.com" + $("#appbar-nav a").attr("href")
            }
        }), { videos: videos });
    }
    else {
        // Alternative
        var playlistVideoList = null;
        try {
            playlistVideoList = JSON.parse(html.split("{\"playlistVideoListRenderer\":{\"contents\":")[1].split("}],\"playlistId\"")[0] + "}]");
        }
        catch (err) { // Playlist not found
            return {};
        }
        for (var i = 0; i < playlistVideoList.length; i++) {
            var videoInfo = playlistVideoList[i].playlistVideoRenderer;
            if (videoInfo === undefined || videoInfo.shortBylineText === undefined)
                continue; //Continue if deleted video
            var video = {
                id: videoInfo.videoId,
                title: videoInfo.title.runs ? videoInfo.title.runs[0].text : videoInfo.title.simpleText,
                duration: getDuration(videoInfo.lengthText.simpleText),
                thumbnail: videoInfo.thumbnail.thumbnails[videoInfo.thumbnail.thumbnails.length - 1].url,
                channel: {
                    id: videoInfo.shortBylineText.runs[0].navigationEndpoint.browseEndpoint.browseId,
                    name: videoInfo.shortBylineText.runs[0].text,
                    url: "https://www.youtube.com" + videoInfo.shortBylineText.runs[0].navigationEndpoint.commandMetadata.webCommandMetadata.url
                }
            };
            videos.push(video);
        }
        var sidebarRenderer = JSON.parse(html.split("{\"playlistSidebarRenderer\":")[1].split("}};</script>")[0]).items;
        var primaryRenderer = sidebarRenderer[0].playlistSidebarPrimaryInfoRenderer;
        var videoOwner = (_b = (_a = sidebarRenderer[1]) === null || _a === void 0 ? void 0 : _a.playlistSidebarSecondaryInfoRenderer.videoOwner) !== null && _b !== void 0 ? _b : undefined;
        var videoCount = 0;
        var viewCount = 0;
        var lastUpdatedAt = "";
        if (primaryRenderer.stats.length === 3) {
            videoCount = +((_c = primaryRenderer.stats[0]) === null || _c === void 0 ? void 0 : _c.runs[0].text.replace(/[^0-9]/g, ""));
            viewCount = +primaryRenderer.stats[1].simpleText.replace(/[^0-9]/g, "");
            lastUpdatedAt = ((_e = (_d = primaryRenderer.stats[2].runs[1]) === null || _d === void 0 ? void 0 : _d.text) !== null && _e !== void 0 ? _e : primaryRenderer.stats[2].simpleText) || primaryRenderer.stats[2].runs[0].text;
        }
        else if (primaryRenderer.stats.length === 2) {
            videoCount = +((_f = primaryRenderer.stats[0]) === null || _f === void 0 ? void 0 : _f.runs[0].text.replace(/[^0-9]/g, ""));
            lastUpdatedAt = primaryRenderer.stats[1].simpleText;
        }
        playlist = __assign(__assign({ id: primaryRenderer.title.runs[0].navigationEndpoint.watchEndpoint.playlistId, title: primaryRenderer.title.runs[0].text, videoCount: videoCount, viewCount: viewCount, lastUpdatedAt: lastUpdatedAt }, videoOwner !== undefined && {
            channel: {
                id: videoOwner.videoOwnerRenderer.title.runs[0].navigationEndpoint.browseEndpoint.browseId,
                name: videoOwner.videoOwnerRenderer.title.runs[0].text,
                thumbnail: videoOwner.videoOwnerRenderer.thumbnail.thumbnails[videoOwner.videoOwnerRenderer.thumbnail.thumbnails.length - 1].url,
                url: "https://www.youtube.com" + videoOwner.videoOwnerRenderer.title.runs[0].navigationEndpoint.commandMetadata.webCommandMetadata.url
            }
        }), { videos: videos });
    }
    return playlist;
}
exports.parseGetPlaylist = parseGetPlaylist;
/**
 * Scrape video result from passed HTML
 *
 * @param html HTML
 */
function parseGetVideo(html) {
    try {
        var relatedPlayer = html.split("RELATED_PLAYER_ARGS': ")[1].split("'BG_P'")[0].split("\n")[0];
        var videoInfo = JSON.parse(JSON.parse(relatedPlayer.substring(0, relatedPlayer.length - 1)).watch_next_response).contents.twoColumnWatchNextResults.results.results.contents[0].itemSectionRenderer.contents[0].videoMetadataRenderer;
        var videoDetails = JSON.parse(JSON.parse(html.split("ytplayer.config = ")[1].split(";ytplayer.load = function()")[0]).args.player_response).videoDetails;
        var tags_1 = [];
        var description_1 = "";
        if (videoInfo.topStandaloneBadge !== undefined) {
            videoInfo.topStandaloneBadge.standaloneCollectionBadgeRenderer.label.runs.forEach(function (tag) {
                if (tag.text.trim())
                    tags_1.push(tag.text);
            });
        }
        if (videoInfo.description !== undefined) {
            videoInfo.description.runs.forEach(function (descriptionPart) {
                description_1 += descriptionPart.text;
            });
        }
        var video = {
            id: videoInfo.videoId,
            title: videoInfo.title.runs[0].text,
            duration: +videoDetails.lengthSeconds || null,
            thumbnail: videoDetails.thumbnail.thumbnails[+videoDetails.thumbnail.thumbnails.length - 1].url,
            description: description_1,
            channel: {
                id: videoInfo.owner.videoOwnerRenderer.title.runs[0].navigationEndpoint.browseEndpoint.browseId,
                name: videoInfo.owner.videoOwnerRenderer.title.runs[0].text,
                thumbnail: videoInfo.owner.videoOwnerRenderer.thumbnail.thumbnails[videoInfo.owner.videoOwnerRenderer.thumbnail.thumbnails.length - 1].url.startsWith("https:") ?
                    videoInfo.owner.videoOwnerRenderer.thumbnail.thumbnails[videoInfo.owner.videoOwnerRenderer.thumbnail.thumbnails.length - 1].url :
                    "https:" + videoInfo.owner.videoOwnerRenderer.thumbnail.thumbnails[videoInfo.owner.videoOwnerRenderer.thumbnail.thumbnails.length - 1].url,
                url: "https://www.youtube.com/channel/" + videoInfo.owner.videoOwnerRenderer.title.runs[0].navigationEndpoint.browseEndpoint.browseId
            },
            uploadDate: videoInfo.dateText.simpleText,
            viewCount: +videoDetails.viewCount,
            likeCount: videoInfo.likeButton.likeButtonRenderer.likeCount !== undefined ? videoInfo.likeButton.likeButtonRenderer.likeCount : null,
            dislikeCount: videoInfo.likeButton.likeButtonRenderer.dislikeCount !== undefined ? videoInfo.likeButton.likeButtonRenderer.likeCount : null,
            isLiveContent: videoDetails.isLiveContent,
            tags: tags_1
        };
        return video;
    }
    catch (err) { // Alternative
        var contents = void 0;
        try {
            contents = JSON.parse(html.split("var ytInitialData = ")[1].split(";</script>")[0]).contents.twoColumnWatchNextResults.results.results.contents;
        }
        catch (err) {
            return {}; // Video not found;
        }
        var secondaryInfo = contents[1].videoSecondaryInfoRenderer;
        var primaryInfo = contents[0].videoPrimaryInfoRenderer;
        var videoDetails = void 0;
        try {
            videoDetails = JSON.parse(html.split("var ytInitialPlayerResponse = ")[1].split(";</script>")[0]).videoDetails;
        }
        catch (err) {
            videoDetails = JSON.parse(html.split("var ytInitialPlayerResponse = ")[1].split(";var meta")[0]).videoDetails;
        }
        var videoInfo = __assign(__assign(__assign({}, secondaryInfo), primaryInfo), { videoDetails: videoDetails });
        var tags_2 = [];
        var description_2 = "";
        if (videoInfo.superTitleLink !== undefined) {
            videoInfo.superTitleLink.runs.forEach(function (tag) {
                if (tag.text.trim())
                    tags_2.push(tag.text);
            });
        }
        if (videoInfo.description !== undefined) {
            videoInfo.description.runs.forEach(function (descriptionPart) {
                description_2 += descriptionPart.text;
            });
        }
        var video = {
            id: videoInfo.videoDetails.videoId,
            title: videoInfo.title.runs[0].text,
            duration: +videoInfo.videoDetails.lengthSeconds || null,
            thumbnail: videoInfo.videoDetails.thumbnail.thumbnails[videoInfo.videoDetails.thumbnail.thumbnails.length - 1].url,
            description: description_2,
            channel: {
                id: videoInfo.owner.videoOwnerRenderer.title.runs[0].navigationEndpoint.browseEndpoint.browseId,
                name: videoInfo.owner.videoOwnerRenderer.title.runs[0].text,
                thumbnail: videoInfo.owner.videoOwnerRenderer.thumbnail.thumbnails[videoInfo.owner.videoOwnerRenderer.thumbnail.thumbnails.length - 1].url.startsWith("https:") ?
                    videoInfo.owner.videoOwnerRenderer.thumbnail.thumbnails[videoInfo.owner.videoOwnerRenderer.thumbnail.thumbnails.length - 1].url :
                    "https:" + videoInfo.owner.videoOwnerRenderer.thumbnail.thumbnails[videoInfo.owner.videoOwnerRenderer.thumbnail.thumbnails.length - 1].url,
                url: "https://www.youtube.com/channel/" + videoInfo.owner.videoOwnerRenderer.title.runs[0].navigationEndpoint.browseEndpoint.browseId
            },
            uploadDate: videoInfo.dateText.simpleText,
            viewCount: +videoInfo.videoDetails.viewCount,
            likeCount: videoInfo.videoActions.menuRenderer.topLevelButtons[0].toggleButtonRenderer.defaultText.accessibility ?
                +videoInfo.videoActions.menuRenderer.topLevelButtons[0].toggleButtonRenderer.defaultText.accessibility.accessibilityData.label.replace(/[^0-9]/g, "") :
                null,
            dislikeCount: videoInfo.videoActions.menuRenderer.topLevelButtons[1].toggleButtonRenderer.defaultText.accessibility ?
                +videoInfo.videoActions.menuRenderer.topLevelButtons[1].toggleButtonRenderer.defaultText.accessibility.accessibilityData.label.replace(/[^0-9]/g, "") :
                null,
            isLiveContent: videoInfo.videoDetails.isLiveContent,
            tags: tags_2
        };
        return video;
    }
}
exports.parseGetVideo = parseGetVideo;
/**
 * Scrape related video from a video from passed HTML
 *
 * @param html HTML
 */
function parseGetRelated(html, limit) {
    var videosInfo = [];
    var scrapped = false;
    try {
        var relatedPlayer = html.split("RELATED_PLAYER_ARGS': ")[1].split("'BG_P'")[0].split("\n")[0];
        videosInfo = JSON.parse(JSON.parse(relatedPlayer.substring(0, relatedPlayer.length - 1)).watch_next_response).contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results;
        scrapped = true;
    }
    catch (err) { }
    if (!scrapped) {
        try {
            videosInfo = JSON.parse(html.split("{\"secondaryResults\":{\"results\":")[1].split(",\"continuations\":[{")[0]);
            scrapped = true;
        }
        catch (err) { }
    }
    if (!scrapped) {
        try {
            videosInfo = JSON.parse(html.split("secondaryResults\":{\"secondaryResults\":")[1].split("},\"autoplay\":{\"autoplay\":{")[0]).results;
            scrapped = true;
        }
        catch (err) { }
    }
    if (!scrapped) {
        return [];
    }
    var relatedVideos = [];
    for (var i = 0; i < videosInfo.length; i++) {
        var videoInfo = videosInfo[i].compactVideoRenderer;
        if (videoInfo === undefined || videoInfo.viewCountText === undefined)
            continue;
        var video = {
            id: videoInfo.videoId,
            title: videoInfo.title.simpleText,
            duration: videoInfo.lengthText ? getDuration(videoInfo.lengthText.simpleText) : null,
            thumbnail: videoInfo.thumbnail.thumbnails[videoInfo.thumbnail.thumbnails.length - 1].url,
            channel: {
                id: videoInfo.longBylineText.runs[0].navigationEndpoint.browseEndpoint.browseId,
                name: videoInfo.longBylineText.runs[0].text,
                url: "https://www.youtube.com/channel/" + videoInfo.longBylineText.runs[0].navigationEndpoint.browseEndpoint.browseId
            },
            uploadDate: videoInfo.publishedTimeText ? videoInfo.publishedTimeText.simpleText : null,
            viewCount: videoInfo.viewCountText && videoInfo.viewCountText.simpleText ? +videoInfo.viewCountText.simpleText.replace(/[^0-9]/g, "") : +videoInfo.viewCountText.runs[0].text.replace(/[^0-9]/g, ""),
        };
        if (relatedVideos.length < limit)
            relatedVideos.push(video);
        else
            break;
    }
    return relatedVideos;
}
exports.parseGetRelated = parseGetRelated;
/**
 * Scrape up next video from a video from passed HTML
 *
 * @param html HTML
 */
function parseGetUpNext(html) {
    var videoInfo = null;
    var scrapped = false;
    try {
        var relatedPlayer = html.split("RELATED_PLAYER_ARGS': ")[1].split("'BG_P'")[0].split("\n")[0];
        videoInfo = JSON.parse(JSON.parse(relatedPlayer.substring(0, relatedPlayer.length - 1)).watch_next_response).contents.twoColumnWatchNextResults.secondaryResults.secondaryResults.results[0].compactAutoplayRenderer.contents[0].compactVideoRenderer;
        scrapped = true;
    }
    catch (err) { }
    if (!scrapped) {
        try {
            videoInfo = JSON.parse(html.split("{\"secondaryResults\":{\"results\":")[1].split(",\"continuations\":[{")[0])[0].compactAutoplayRenderer.contents[0].compactVideoRenderer;
            scrapped = true;
        }
        catch (err) { }
    }
    if (!scrapped) {
        try {
            videoInfo = JSON.parse(html.split("secondaryResults\":{\"secondaryResults\":")[1].split("},\"autoplay\":{\"autoplay\":{")[0]).results[0].compactAutoplayRenderer.contents[0].compactVideoRenderer;
            scrapped = true;
        }
        catch (err) { }
    }
    if (!scrapped || videoInfo === null)
        return {}; // Video not found
    var upNext = {
        id: videoInfo.videoId,
        channel: {
            id: videoInfo.longBylineText.runs[0].navigationEndpoint.browseEndpoint.browseId,
            name: videoInfo.longBylineText.runs[0].text,
            url: "https://www.youtube.com/channel/" + videoInfo.longBylineText.runs[0].navigationEndpoint.browseEndpoint.browseId
        },
        title: videoInfo.title.simpleText,
        duration: videoInfo.lengthText ? getDuration(videoInfo.lengthText.simpleText) : null,
        thumbnail: videoInfo.thumbnail.thumbnails[videoInfo.thumbnail.thumbnails.length - 1].url,
        uploadDate: videoInfo.publishedTimeText ? videoInfo.publishedTimeText.simpleText : null,
        viewCount: videoInfo.viewCountText && videoInfo.viewCountText.simpleText ? +videoInfo.viewCountText.simpleText.replace(/[^0-9]/g, "") : null,
    };
    return upNext;
}
exports.parseGetUpNext = parseGetUpNext;
exports.default = {
    parseSearch: parseSearch,
    parseGetPlaylist: parseGetPlaylist,
    parseGetVideo: parseGetVideo,
    parseGetRelated: parseGetRelated,
    parseGetUpNext: parseGetUpNext
};
