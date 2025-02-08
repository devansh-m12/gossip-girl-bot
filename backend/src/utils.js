// privy.js
import dotenv from "dotenv";

dotenv.config();

import {PrivyClient} from '@privy-io/server-auth';

const privy = new PrivyClient(process.env.PRIVY_APP_ID, process.env.PRIVY_APP_SECRET);

export default privy;
