# Cockpit
Welcome to the Cockpit, where you'll be able to automatically download videos from floatplane.

Return json object with a list of channels the user is subscribed to 
GET /api/v1/channels

Returns the selected channel settings
GET /api/v1/channels/:channelId/settings

Updates the selected channel settings and returns the updated settings
PUT /api/v1/channels/:channelId/settings

Return all of the videos of the selected channel
GET /api/v1/channels/:channelId/videos

add middleware to validate the current connections
