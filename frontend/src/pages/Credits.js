import { Link } from "react-router-dom";

export default function Credits() {
  return (
    <div className="pt-5 bg-slate-200 h-full">
      <b>
        <h1 className="text-center text-4xl font-large text-blue-900">
          Credits
        </h1>
      </b>
      <br />
      <div className="pl-10">
        <b>
          <h1>Styles & Icons</h1>
        </b>
        <ul className="list-disc pl-5">
          <li>
            <a
              className="underline"
              href="https://tailwindcss.com/docs/installation"
            >
              Tailwind CSS
            </a>
          </li>
          <li>
            <a
              className="underline"
              href="https://tailwindui.com/components/application-ui/elements/dropdowns"
            >
              Tailwind Dropdown Component
            </a>
          </li>
          <li>
            <a
              className="underline"
              href="https://v1.tailwindcss.com/components/alerts"
            >
              Tailwind Alerts Component
            </a>
          </li>

          <li>
            <a
              className="underline"
              href="https://icon-icons.com/icon/google/62736"
            >
              Google Icon
            </a>
          </li>
        </ul>
      </div>
      <br />
      <div className="pl-10">
        <b>
          <h1>Documentation & Videos</h1>
        </b>
        <ul className="list-disc pl-5">
          <li>
            <a
              className="underline"
              href="https://firebase.google.com/docs/auth/web/firebaseui"
            >
              Firebase Web
            </a>
          </li>
          <li>
            <a
              className="underline"
              href="https://firebase.google.com/docs/auth/admin/verify-id-tokens#verify_id_tokens_using_the_firebase_admin_sdk"
            >
              Firebase Admin
            </a>
          </li>
          <li>
            <a
              className="underline"
              href="https://www.youtube.com/watch?v=MG3ZTfdxODA&ab_channel=DailyWebCoding"
            >
              Firebase Login
            </a>
          </li>
          <li>
            <a
              className="underline"
              href="https://github.com/feross/simple-peer"
            >
              Simple Peer
            </a>
          </li>
          <li>
            <a
              className="underline"
              href="https://socket.io/docs/v4/redis-adapter/"
            >
              Redis Adapter
            </a>
          </li>
          <li>
            <a
              className="underline"
              href="https://socket.io/docs/v4/client-api/"
            >
              Socket IO
            </a>
          </li>
          <li>
            <a
              className="underline"
              href="https://www.youtube.com/watch?v=R1sfHPwEH7A&ab_channel=CodingWithChaim"
            >
              Video Chat
            </a>
          </li>
          <li>
            <a
              className="underline"
              href="https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs#how-to-send-an-api-email"
            >
              SendGrid
            </a>
          </li>
          <li>
            <a
              className="underline"
              href="https://github.com/googleapis/google-api-nodejs-client#getting-started"
            >
              Google API
            </a>
          </li>
          <li>
            <a className="underline" href="https://docs.bullmq.io/">
              BullMQ
            </a>
          </li>
          <li>
            <a
              className="underline"
              href="https://mherman.org/blog/dockerizing-a-react-app/"
            >
              Dockerizing React & nginx
            </a>{" "}
            & CSCC09 Lab 10 docker compose
          </li>
          <li>
            <a
              className="underline"
              href="https://mongoosejs.com/docs/guide.html"
            >
              Mongoose
            </a>
          </li>
          <li>
            <a
              className="underline"
              href="https://github.com/js-cookie/js-cookie#basic-usage"
            >
              JavaScript Cookies
            </a>
          </li>
        </ul>
      </div>
      <Link to="/">
        <h6 className="underline sticky bottom-0 text-center left-0 right-0 pb-5 text-violet-500">
          home
        </h6>
      </Link>
    </div>
  );
}
