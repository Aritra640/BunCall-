import "./index.css";
import { RecoilRoot, useRecoilValue } from "recoil";
import { HomePage } from "./pages/homePage";

export function App() {

  return (
    <div className="bg-black text-white">
      <RecoilRoot>
        <HomePage />
      </RecoilRoot>
    </div>
  );
}

export default App;
