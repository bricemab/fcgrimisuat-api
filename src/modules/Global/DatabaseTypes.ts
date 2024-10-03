/* eslint-disable camelcase */
import { CampaignStatus } from "../Campaigns/CampaignStatus";
import { CampaignLogAction } from "../CampaignLogs/CampaignLogAction";

export interface DataBaseUser {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  company_id: number;
  archived: number;
}

export interface DataBaseCampaign {
  id: number;
  name: string;
  status: CampaignStatus;
  mail_template_id: number;
  web_template_id: number;
  email_group_id: number;
  creator_id: number;
  save_data: number;
  mail_display_name: string;
  date: Date;
  last_modified_date: Date;
  company_id: number;
  archived: number;
}

export interface DataBaseCampaignLog {
  id: number;
  action: CampaignLogAction;
  target_user_id: number;
  target_user_token: string;
  target_user_email: string;
  date: Date;
  email_group_id: number;
  user_id: number;
  campaign_id: number;
  username: string;
  password: string;
  subject: string;
  data: string;
  email_send_test: string;
}

export interface DataBaseWebTemplate {
  id: number;
  name: string;
  template: string;
  text_replace: string;
  redirect_url: string;
  import_url: string;
  company_id: number;
  archived: number;
}

export interface DataBaseEmailGroup {
  id: number;
  name: string;
  company_id: number;
  archived: number;
}

export interface DataBaseTargetUser {
  id: number;
  email: string;
  lastname: string;
  firstname: string;
  token: string;
  email_group_id: number;
  archived: number;
}

export interface DataBaseMailTemplate {
  id: number;
  name: string;
  subject: string;
  template: string;
  company_id: number;
  archived: number;
}

export interface DataBaseLanguage {
  id: number;
  name: string;
  short_name: string;
  locale: string;
  ou_name: string;
}

export interface DataBaseSiteDomain {
  id: number;
  name: string;
  domain_extension: string;
  site_id: string;
}

export interface DataBaseSiteFolderToCreate {
  id: number;
  absolute_path: string;
  permissions: string;
  is_hidden: number;
  add_to_new_user: number;
  add_to_new_group: number;
  add_to_new_distribution: number;
  add_to_new_resource: number;
  site_id: number;
}

export interface DataBaseSiteLdapAttributes {
  id: number;
  attribute: string;
  value: string;
  add_to_new_user: number;
  add_to_new_group: number;
  add_to_new_distribution: number;
  add_to_new_resource: number;
  sites_id: number;
}

// eslint-disable-next-line import/prefer-default-export
export enum DataBaseSitePowershellScriptType {
  POWER_SHELL = "POWER_SHELL",
  CMD = "CMD",
  EXCHANGE = "EXCHANGE"
}

export interface DataBaseSiteCustomScript {
  id: number;
  script_file_name: string;
  script_type: DataBaseSitePowershellScriptType;
  parameters: string;
  execute_to_new_user: number;
  execute_to_new_group: number;
  execute_to_new_distribution: number;
  execute_to_new_resource: number;
  site_id: number;
}

export interface DataBaseGroups {
  id: number;
  label: string;
  dn: string;
  system_denomination: string;
  add_to_new_user: number;
  add_to_new_group: number;
  add_to_new_distribution: number;
  add_to_new_resource: number;
  is_system_group: number;
}

export interface DataBaseActivityLog {
  id: number;
  login_id: string;
  login_display_name: string;
  operation_code: string;
  operation_module: string;
  operation_entity_id: string | null;
  operation_entity_display_name: string | null;
  operation_entity_id_2: string | null;
  operation_entity_display_name_2: string | null;
  date: Date;
  site_key: string;
}
