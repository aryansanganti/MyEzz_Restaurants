//restrauntsignup.jsx
import { useState } from "react"
import { supabase } from "../supabaseClient"
import { useNavigate } from "react-router-dom"

export default function RestaurantSignup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const fillDemo = () => {
    setUsername("demo@restaurant.com")
    setPassword("demopassword")
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email: username,
      password: password,
    })

    if (error) {
      alert(error.message)
    } else {
      alert("Signup successful. Check email.")
      // TODO: Fetch actual restaurant ID from Supabase after profile creation
      navigate('/1/orders');
    }

    setLoading(false)
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Restaurant Signup</h2>

      <button
        type="button"
        onClick={fillDemo}
        style={{ marginBottom: "20px" }}
      >
        Use Demo Credentials
      </button>

      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Username (Email)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Signup"}
        </button>
      </form>
    </div>
  )
}
