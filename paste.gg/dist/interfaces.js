"use strict";
/*
 * Copyright © SerenModz21 2018 - 2021 All Rights Reserved.
 * Unauthorized distribution of any code within this project may result in consequences chosen.
 * Refer to the README for more information.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Methods = void 0;
var Methods;
(function (Methods) {
    Methods["GET"] = "GET";
    Methods["POST"] = "POST";
    Methods["DELETE"] = "DELETE";
    Methods["PATCH"] = "PATCH";
})(Methods = exports.Methods || (exports.Methods = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9pbnRlcmZhY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztHQUlHOzs7QUFFSCxJQUFZLE9BS1g7QUFMRCxXQUFZLE9BQU87SUFDakIsc0JBQVcsQ0FBQTtJQUNYLHdCQUFhLENBQUE7SUFDYiw0QkFBaUIsQ0FBQTtJQUNqQiwwQkFBZSxDQUFBO0FBQ2pCLENBQUMsRUFMVyxPQUFPLEdBQVAsZUFBTyxLQUFQLGVBQU8sUUFLbEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IMKpIFNlcmVuTW9kejIxIDIwMTggLSAyMDIxIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKiBVbmF1dGhvcml6ZWQgZGlzdHJpYnV0aW9uIG9mIGFueSBjb2RlIHdpdGhpbiB0aGlzIHByb2plY3QgbWF5IHJlc3VsdCBpbiBjb25zZXF1ZW5jZXMgY2hvc2VuLlxuICogUmVmZXIgdG8gdGhlIFJFQURNRSBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAqL1xuXG5leHBvcnQgZW51bSBNZXRob2RzIHtcbiAgR0VUID0gXCJHRVRcIixcbiAgUE9TVCA9IFwiUE9TVFwiLFxuICBERUxFVEUgPSBcIkRFTEVURVwiLFxuICBQQVRDSCA9IFwiUEFUQ0hcIixcbn1cblxuZXhwb3J0IHR5cGUgSUhlYWRlciA9IHtcbiAgXCJDb250ZW50LVR5cGVcIj86IHN0cmluZztcbiAgQXV0aG9yaXphdGlvbj86IHN0cmluZztcbn07XG5cbmV4cG9ydCBpbnRlcmZhY2UgT3B0aW9ucyB7XG4gIGJhc2VVcmw6IHN0cmluZztcbiAgbWFpblVybDogc3RyaW5nO1xuICB2ZXJzaW9uOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUmVzdWx0IHtcbiAgaWQ6IHN0cmluZztcbiAgbmFtZT86IHN0cmluZztcbiAgdXJsPzogc3RyaW5nO1xuICBhdXRob3I/OiBBdXRob3I7XG4gIGRlc2NyaXB0aW9uPzogc3RyaW5nO1xuICB2aXNpYmlsaXR5PzogXCJwdWJsaWNcIiB8IFwidW5saXN0ZWRcIiB8IFwicHJpdmF0ZVwiO1xuICBjcmVhdGVkX2F0OiBzdHJpbmc7XG4gIHVwZGF0ZWRfYXQ6IHN0cmluZztcbiAgZXhwaXJlcz86IHN0cmluZztcbiAgZmlsZXM/OiBGaWxlW107XG4gIGRlbGV0aW9uX2tleT86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPdXRwdXQge1xuICBzdGF0dXM6IHN0cmluZztcbiAgcmVzdWx0PzogUmVzdWx0O1xuICBlcnJvcj86IHN0cmluZztcbiAgbWVzc2FnZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBBdXRob3Ige1xuICBpZD86IHN0cmluZztcbiAgdXNlcm5hbWU/OiBzdHJpbmc7XG4gIG5hbWU/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUG9zdFxuICBleHRlbmRzIFBpY2s8UmVzdWx0LCBcIm5hbWVcIiB8IFwiZGVzY3JpcHRpb25cIiB8IFwidmlzaWJpbGl0eVwiIHwgXCJleHBpcmVzXCI+IHtcbiAgZmlsZXM6IEZpbGVPdXRbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVcGRhdGUgZXh0ZW5kcyBQaWNrPFJlc3VsdCwgXCJuYW1lXCI+IHtcbiAgZGVzY3JpcHRpb246IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBGaWxlIHtcbiAgaWQ6IHN0cmluZztcbiAgbmFtZTogc3RyaW5nO1xuICBoaWdobGlnaHRfbGFuZ3VhZ2U/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmlsZU91dCB7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIGNvbnRlbnQ6IENvbnRlbnQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29udGVudCBleHRlbmRzIFBpY2s8RmlsZSwgXCJoaWdobGlnaHRfbGFuZ3VhZ2VcIj4ge1xuICBmb3JtYXQ6IFwidGV4dFwiIHwgXCJiYXNlNjRcIiB8IFwiZ3ppcFwiIHwgXCJ4elwiO1xuICB2YWx1ZTogc3RyaW5nO1xufVxuIl19