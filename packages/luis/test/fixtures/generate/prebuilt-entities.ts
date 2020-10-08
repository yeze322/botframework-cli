/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import {
  DateTimeSpec,
  GeographyV2,
  InstanceData,
  IntentData,
  NumberWithUnits,
  OrdinalV2,
} from 'botbuilder-ai';

export interface GeneratedIntents {}

export interface GeneratedInstance {
  a?: InstanceData[];
  age?: InstanceData[];
  arrive?: InstanceData[];
  b?: InstanceData[];
  begin?: InstanceData[];
  child?: InstanceData[];
  datetime?: InstanceData[];
  dimension?: InstanceData[];
  email?: InstanceData[];
  end?: InstanceData[];
  endloc?: InstanceData[];
  endpos?: InstanceData[];
  geographyV2?: InstanceData[];
  leave?: InstanceData[];
  length?: InstanceData[];
  max?: InstanceData[];
  maximum?: InstanceData[];
  min?: InstanceData[];
  minimum?: InstanceData[];
  money?: InstanceData[];
  newPhone?: InstanceData[];
  number?: InstanceData[];
  old?: InstanceData[];
  oldURL?: InstanceData[];
  ordinal?: InstanceData[];
  ordinalV2?: InstanceData[];
  parent?: InstanceData[];
  percentage?: InstanceData[];
  personName?: InstanceData[];
  phonenumber?: InstanceData[];
  receiver?: InstanceData[];
  sender?: InstanceData[];
  start?: InstanceData[];
  startloc?: InstanceData[];
  startpos?: InstanceData[];
  temperature?: InstanceData[];
  url?: InstanceData[];
  width?: InstanceData[];
}

export interface GeneratedEntities {
  // Simple entities

  // Built-in entities
  age?: NumberWithUnits[];
  begin?: string[];
  end?: string[];
  datetime?: DateTimeSpec[];
  arrive?: string[];
  leave?: string[];
  dimension?: NumberWithUnits[];
  length?: string[];
  width?: string[];
  email?: string[];
  receiver?: string[];
  sender?: string[];
  geographyV2?: GeographyV2[];
  endloc?: string[];
  startloc?: string[];
  money?: NumberWithUnits[];
  max?: string[];
  min?: string[];
  number?: number[];
  ordinal?: number[];
  start?: string[];
  ordinalV2?: OrdinalV2[];
  endpos?: string[];
  startpos?: string[];
  percentage?: number[];
  maximum?: string[];
  minimum?: string[];
  personName?: string[];
  child?: string[];
  parent?: string[];
  phonenumber?: string[];
  newPhone?: string[];
  old?: string[];
  temperature?: NumberWithUnits[];
  a?: string[];
  b?: string[];
  url?: string[];
  oldURL?: string[];

  // Lists

  // Regex entities

  // Pattern.any

  // Composites
  $instance: GeneratedInstance;
}

export interface ContosoApp {
  text: string;
  alteredText?: string;
  intents: GeneratedIntents;
  entities: GeneratedEntities;
  [propName: string]: any;
}
