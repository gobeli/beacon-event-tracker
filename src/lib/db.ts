import * as S from "@effect/schema/Schema";
import {
  createEvolu,
  id,
  table,
  database,
  cast,
} from "@evolu/react";
 
const EventId = id("Event");
export type EventId = typeof EventId.Type;

const EventType = S.Literal('enter', 'exit', 'sit', 'stand');
export type EventType = typeof EventType.Type;


const EventTable = table({
  id: EventId,
  type: EventType
});
type EventTable = typeof EventTable.Type;
 
const Database = database({
  event: EventTable,
  
});
export type Database = typeof Database.Type;
 
export const evolu = createEvolu(Database);

evolu.subscribeOwner(() => {
  console.log(evolu.getOwner())
})

export const getAllEvents = evolu.createQuery((db) => db.selectFrom('event')
  .where('isDeleted', 'is not', cast(true))
  .orderBy('createdAt desc')
  .selectAll()
);

