const axios = require('axios');

module.exports = async (req, res) => {
    // Get data from the request body
    const { url, startDate, endDate } = req.body;

    // Replace with your Facebook API access token
    const ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

    try {
        // Call the Facebook Graph API to get posts
        const response = await axios.get(`https://graph.facebook.com/v11.0/${url}/posts`, {
            params: {
                access_token: ACCESS_TOKEN,
                fields: 'id,message,created_time,engagement',
                since: startDate,
                until: endDate,
            },
        });

        // Extract and sort posts by engagement
        const posts = response.data.data;
        const sortedPosts = posts.sort((a, b) => {
            const engagementA = a.engagement ? a.engagement.count : 0;
            const engagementB = b.engagement ? b.engagement.count : 0;
            return engagementB - engagementA;
        });

        // Send sorted posts back to the client
        res.status(200).json(sortedPosts);
    } catch (error) {
        console.error('Error fetching posts:', error.message);
        res.status(500).json({ error: 'Error fetching posts' });
    }
};
