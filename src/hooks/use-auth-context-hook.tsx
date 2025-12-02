import { useEffect, useState } from "react";

function useAuth(): boolean {
  const [is_logged_in, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
      fetch("/api/login/status")
      .then(res => res.json())
      .then(data => setIsLoggedIn(data.logged_in))
      .catch((error) => {
        console.error("Error fetching login status:", error);
        setIsLoggedIn(false);
      });
  }, [setIsLoggedIn]);

  return is_logged_in;
}

export default useAuth;