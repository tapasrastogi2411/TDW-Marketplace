import { signInToApp } from "../service/auth";
import { googleProvider } from "../config/authMethods";
import { useNavigate } from "react-router-dom";

export default function LoginProvider(props) {
  const navigate = useNavigate();

  const handleSignIn = async (provider) => {
    signInToApp(provider).then(() => {
      navigate("/");
    });
  };

  const providers = { Google: googleProvider };
  return (
    <button
      onClick={() => handleSignIn(providers[props.details.providerName])}
      className="flex justify-center items-center border w-4/6 md:w-1/3 lg:w-1/4 ml-auto mr-auto border-current py-3 rounded-3xl	mt-3"
    >
      <div>
        <img
          className="w-8 h-8"
          src={props.details.icon}
          alt={props.details.providerName}
        />
      </div>
      <div className="ml-3"> Continue with {props.details.providerName}</div>
    </button>
  );
}
