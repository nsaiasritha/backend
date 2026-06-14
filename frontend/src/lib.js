export const apibaseurl = "http://localhost:8000";

export const apicall = async (url, method = "GET", body = null) => {
    const jwtToken = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (jwtToken) headers["Token"] = jwtToken;

    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);

    const response = await fetch(`${apibaseurl}${url}`, options);
    return await response.json();
};
