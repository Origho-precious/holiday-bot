export interface ISlackEvent {
  client_msg_id: string;
  ts: string;
  text: string;
  user: string;
  team: string;
  channel: string;
  event_ts: string;
  type: "app_mention" | "message";
  blocks: [{ type: string; block_id: string }];
}
