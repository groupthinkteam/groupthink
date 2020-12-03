export function summarize(args, callback) {
    const API_KEY = "89A59B5393";
    fetch(`https://api.smmry.com/SM_API_KEY=${API_KEY}&SM_URL=${args.url}`)
        .then((response) => {
            if (response.sm_api_error === undefined) {
                callback(false)
            }
            callback(
                {
                    percentReduced: response.sm_api_content_reduced,
                    content: response.sm_api_content
                }
            )
        })
}