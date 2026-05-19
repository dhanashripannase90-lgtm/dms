fetch("https://dms-backend-fdzq.onrender.com/api/auth/request-otp", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "test@example.com", purpose: "REGISTER" })
})
.then(res => res.text().then(text => console.log("Status:", res.status, "Body:", text)))
.catch(err => console.error(err));
