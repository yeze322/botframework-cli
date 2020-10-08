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
  extra?: InstanceData[];
  from?: InstanceData[];
  person?: InstanceData[];
  subject?: InstanceData[];
  to?: InstanceData[];
}

export interface GeneratedEntities {
  // Simple entities

  // Built-in entities

  // Lists

  // Regex entities

  // Pattern.any
  person?: string[];
  from?: string[];
  to?: string[];
  subject?: string[];
  extra?: string[];

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
