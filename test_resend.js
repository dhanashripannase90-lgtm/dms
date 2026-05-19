

fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    "Authorization": "Bearer re_aAgVin1y_F8LhrN5YZWn6AqxzKbEayGi9",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    from: "DMS Portal <onboarding@resend.dev>",
    to: ["dhanashripannase90@gmail.com"],
    subject: "Hello World",
    html: "<p>Congrats on sending your <strong>first email</strong>!</p>"
  })
})
.then(res => res.json().then(data => console.log(res.status, data)))
.catch(err => console.error(err));
