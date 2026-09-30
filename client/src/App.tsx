import { useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";
import { Button } from "./components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <section>
        <h1 className="text-6xl">Hola mundo</h1>
        <Button type="submit" variant={"destructive"}>
          Click
        </Button>
      </section>
    </>
  );
}

export default App;
