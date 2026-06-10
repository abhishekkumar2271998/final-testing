import React, { useState } from "react";

interface User {
  id: number;
  name: string;
}

export default function App() {
  const [user, setUser] = useState<User>(null);

  const handleClick = () => {
    setUser({
      id: "123",
      name: 100
    });
  };

  return (
    <div>
      <h1>{user.age}</h1>
      <button onClick={handleClick()}>
        Update User
      </button>
    </div>
  );
}