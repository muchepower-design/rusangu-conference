export const reportSchemas = {
  stewardship: {
    sections: [
      {
        title: 'A. STRATEGIC OUTCOME INDICATORS',
        fields: [
          { name: 'district', label: 'District', type: 'district_select', required: true },
          { name: 'reporting_period', label: 'Reporting Period', type: 'text', required: true },
          { name: 'membership', label: 'Membership as at 1 January', type: 'number', required: true },
          { name: 'tithers_increase', label: 'Percentage increase in Tithers', type: 'number', required: true },
          { name: 'offering_givers_increase', label: 'Percentage increase in Regular Offering Givers', type: 'number', required: true },
          { name: 'churches_budget', label: 'Number of Churches operating on approved budgets', type: 'number', required: true },
          { name: 'churches_remit', label: 'Number of Churches remitting trust funds monthly', type: 'number', required: true },
          { name: 'churches_poor_alloc', label: 'Number of Churches with budget allocations for the poor', type: 'number', required: true },
          { name: 'churches_initiatives', label: 'Number of churches implementing stewardship initiatives to address low giving', type: 'number', required: true },
        ]
      },
      {
        title: 'B. STRATEGIC PILLAR 1: COMMUNION WITH GOD',
        fields: [
          { name: 'family_worship', label: 'Churches conducting Family Worship promotion programs', type: 'number' },
          { name: 'pfm_lessons', label: 'PFM (Personal Financial Management) lessons conducted', type: 'number' },
          { name: 'weekly_readings', label: 'Weekly Sabbath Stewardship Readings conducted', type: 'number' },
          { name: 'children_envelopes', label: 'Children provided with stewardship envelopes', type: 'number' },
          { name: 'weeks_emphasis', label: 'Stewardship Weeks of Emphasis conducted', type: 'number' },
        ]
      },
      {
        title: 'C. STRATEGIC PILLAR 2: IDENTITY IN CHRIST',
        fields: [
          { name: 'members_visited_nurtured', label: 'Number of members visited and nurtured', type: 'number' },
          { name: 'churches_audited', label: 'Number of churches/companies audited', type: 'number' },
          { name: 'members_disciple_programs', label: 'Members participating in stewardship discipleship programs', type: 'number' },
          { name: 'churches_manual_compliance', label: 'Churches complying with Church Manual requirements on faithful stewardship leadership', type: 'number' },
        ]
      },
      {
        title: 'D. STRATEGIC PILLAR 3: UNITY THROUGH THE HOLY SPIRIT',
        fields: [
          { name: 'combined_offering_lessons', label: 'Lessons conducted on Combined Offering Plan', type: 'number' },
          { name: 'members_income_ventures', label: 'Members assisted to start income-generating ventures', type: 'number' },
          { name: 'occupational_inventories', label: 'Occupational inventories completed by churches', type: 'number' },
          { name: 'arp_meetings', label: 'Account, Review and Planning (ARP) meetings conducted', type: 'number' },
        ]
      },
      {
        title: 'E. STRATEGIC PILLAR 4: MISSION FOR ALL',
        fields: [
          { name: 'systematic_giving_lessons', label: 'Lessons conducted on Systematic Giving', type: 'number' },
          { name: 'general_stewardship_lessons', label: 'General Stewardship Lessons presented', type: 'number' },
          { name: 'pastors_trained_step', label: 'Pastors trained in STEP-DP implementation', type: 'number' },
          { name: 'churches_step_dp', label: 'Churches implementing STEP-DP', type: 'number' },
          { name: 'stewardship_training_leaders', label: 'Stewardship training programs conducted for local church leaders', type: 'number' },
        ]
      },
      {
        title: 'F. BEST PRACTICES AND MEMBER ENGAGEMENT',
        fields: [
          { name: 'best_practice_1', label: 'Most effective method 1', type: 'text' },
          { name: 'best_practice_2', label: 'Most effective method 2', type: 'text' },
          { name: 'best_practice_3', label: 'Most effective method 3', type: 'text' },
          { name: 'key_achievements', label: 'Key Achievements', type: 'textarea' },
          { name: 'challenges', label: 'Challenges', type: 'textarea' },
          { name: 'recommendations', label: 'Recommendations', type: 'textarea' },
        ]
      },
      {
        title: '',
        fields: [
          { name: 'prepared_by', label: 'Prepared By', type: 'auto_name', required: true },
          { name: 'position', label: 'Position', type: 'text', required: true },
          { name: 'date', label: 'Date', type: 'date', required: true },
        ]
      }
    ]
  },

  personal_ministries: {
    sections: [
      {
        title: '',
        fields: [
          { name: 'entity', label: 'Entity', type: 'text', required: true },
          { name: 'director', label: 'Director', type: 'text' },
          { name: 'num_churches', label: 'Number of Churches', type: 'number', required: true },
          { name: 'quarter_ending', label: 'Quarter Ending', type: 'text', required: true },
        ]
      },
      {
        title: 'COMMUNION WITH GOD',
        fields: [
          { name: 'disciple_handbook_churches', label: 'Number of Churches with Discipleship Handbook', type: 'number' },
          { name: 'disciple_trained_churches', label: 'Number of churches trained on how to use the Discipleship Handbook', type: 'number' },
          { name: 'disciple_implementing_pct', label: 'Percentage of churches implementing Discipleship Handbook', type: 'number' },
          { name: 'disciple_webinars', label: 'Number of churches conducting quarterly disciple-making Webinars for Adults', type: 'number' },
          { name: 'spiritual_retreats', label: 'Number of Spiritual Leadership Retreats held', type: 'number' },
          { name: 'midweek_prayers', label: 'Number Churches conducting mid-week prayers', type: 'number' },
          { name: 'observations_challenges_cwg', label: 'Observations/Challenges', type: 'textarea' },
        ]
      },
      {
        title: 'IDENTITY IN CHRIST',
        fields: [
          { name: 'baptismal_nurture_seminars', label: 'Number of seminars conducted on post baptismal nurture', type: 'number' },
          { name: 'baptismal_nurture_pct', label: 'Percentage of newly baptized members completing post baptismal nurture', type: 'number' },
          { name: 'observations_challenges_iic', label: 'Observations/Challenges', type: 'textarea' },
        ]
      },
      {
        title: 'UNITY THROUGH THE HOLY SPIRIT',
        fields: [
          { name: 'joint_evangelism_campaigns', label: 'Number of joint evangelistic campaigns conducted', type: 'number' },
          { name: 'integrated_mission_projects', label: 'Number of integrated mission projects conducted annually', type: 'number' },
          { name: 'timely_reports_pct', label: 'Percentage of conferences submitting timely quarterly reports', type: 'number' },
          { name: 'observations_challenges_uths', label: 'Observations/Challenges', type: 'textarea' },
        ]
      },
      {
        title: 'MISSION FOR ALL',
        fields: [
          { name: 'active_members_gtmi_pct', label: 'Percentage of active members participating in Global Total Member Involvement', type: 'number' },
          { name: 'digital_evangelism', label: 'Number of digital evangelism engagements', type: 'number' },
          { name: 'campaigns_youth_children_pct', label: 'Percentage of evangelistic campaigns including youth and children', type: 'number' },
          { name: 'new_churches_planted', label: 'Number of new churches planted', type: 'number' },
          { name: 'new_areas_mapped_pct', label: 'Percentage of newly entered areas mapped and opened', type: 'number' },
          { name: 'community_outreach_events', label: 'Number of Community outreach events', type: 'number' },
          { name: 'community_service_members', label: 'Number of members participating in community service', type: 'number' },
          { name: 'community_outreach_events_dup', label: 'Number of Community Outreach Events', type: 'number' },
          { name: 'literature_distributed', label: 'Pieces of Literature Distributed', type: 'number' },
          { name: 'lay_crusades', label: 'Number of crusades conducted by the Lay Preachers', type: 'number' },
          { name: 'pastor_campaigns', label: 'Number of Campaigns conducted by Pastors', type: 'number' },
          { name: 'witnessing_sabbath', label: 'Number of churches going out for witnessing 1st Sabbath of the month', type: 'number' },
          { name: 'lay_bible_studies', label: 'Number of Bible studies conducted by Lay preachers', type: 'number' },
          { name: 'total_baptisms', label: 'Total Baptisms for the Quarter according to statistical report', type: 'number' },
          { name: 'observations_challenges_mfa', label: 'Observations/Challenges', type: 'textarea' },
        ]
      },
      {
        title: '',
        fields: [
          { name: 'prepared_by', label: 'Prepared by (PM Leader)', type: 'auto_name', required: true },
          { name: 'prepared_signature', label: 'Signature', type: 'text' },
          { name: 'reviewed_by', label: 'Reviewed by (Pastor)', type: 'text' },
          { name: 'reviewed_signature', label: 'Signature', type: 'text' },
          { name: 'approved_by', label: 'Approved by (SSPM Director)', type: 'text' },
          { name: 'approved_signature', label: 'Signature', type: 'text' },
          { name: 'date_submitted', label: 'Date Submitted', type: 'date', required: true },
        ]
      }
    ]
  },

  sabbath_school: {
    sections: [
      {
        title: '',
        fields: [
          { name: 'conference_field', label: 'Name of Conference/Field', type: 'text', required: true },
          { name: 'district', label: 'District', type: 'district_select', required: true },
          { name: 'local_church', label: 'Local Church', type: 'text', required: true },
          { name: 'superintendent', label: 'Superintendent', type: 'text' },
          { name: 'director', label: 'Director', type: 'text' },
          { name: 'quarter', label: 'Quarter', type: 'text', required: true },
          { name: 'year', label: 'Year', type: 'text', required: true },
          { name: 'ss_membership', label: 'Sabbath School Membership', type: 'number', required: true },
          { name: 'num_churches', label: 'Number of Churches', type: 'number', required: true },
        ]
      },
      {
        title: 'COMMUNION WITH GOD',
        fields: [
          { name: 'attendance_increase_prev', label: 'Increase in sabbath school attendance (Previous Q)', type: 'number' },
          { name: 'attendance_increase_curr', label: 'Increase in sabbath school attendance (Current Q)', type: 'number' },
          { name: 'daily_study_hardcopy_prev', label: 'Number of members who daily study their lesson using hard copy (Previous Q)', type: 'number' },
          { name: 'daily_study_hardcopy_curr', label: 'Number of members who daily study their lesson using hard copy (Current Q)', type: 'number' },
          { name: 'daily_study_softcopy_prev', label: 'Number of members who daily study their lesson using soft copy (Previous Q)', type: 'number' },
          { name: 'daily_study_softcopy_curr', label: 'Number of members who daily study their lesson using soft copy (Current Q)', type: 'number' },
          { name: 'supt_trained_prev', label: '# of Sabbath school Superintendents trained in disciple making (Previous Q)', type: 'number' },
          { name: 'supt_trained_curr', label: '# of Sabbath school Superintendents trained in disciple making (Current Q)', type: 'number' },
          { name: 'study_guides_purchased_prev', label: 'Number of Study Guides Purchased (Previous Q)', type: 'number' },
          { name: 'study_guides_purchased_curr', label: 'Number of Study Guides Purchased (Current Q)', type: 'number' },
          { name: 'study_guides_use_prev', label: 'Number of churches using the Study Guides for all divisions (Previous Q)', type: 'number' },
          { name: 'study_guides_use_curr', label: 'Number of churches using the Study Guides for all divisions (Current Q)', type: 'number' },
          { name: 'observations_challenges_cwg', label: 'Observations / Challenges', type: 'textarea' },
        ]
      },
      {
        title: 'IDENTITY IN CHRIST',
        fields: [
          { name: 'ss_alive_prev', label: 'Number of churches implementing the Sabbath School Alive (Previous Q)', type: 'number' },
          { name: 'ss_alive_curr', label: 'Number of churches implementing the Sabbath School Alive (Current Q)', type: 'number' },
          { name: 'post_baptismal_class_prev', label: 'Number of churches having post baptismal nurture class (Previous Q)', type: 'number' },
          { name: 'post_baptismal_class_curr', label: 'Number of churches having post baptismal nurture class (Current Q)', type: 'number' },
          { name: 'observations_challenges_iic', label: 'Observations/Challenges', type: 'textarea' },
        ]
      },
      {
        title: 'UNITY THROUGH THE HOLY SPIRIT',
        fields: [
          { name: 'supt_training_prev', label: 'Number of trainings conducted for sabbath school superintendents (Previous Q)', type: 'number' },
          { name: 'supt_training_curr', label: 'Number of trainings conducted for sabbath school superintendents (Current Q)', type: 'number' },
          { name: 'teachers_trained_prev', label: 'Number of Sabbath school teachers trained (Previous Q)', type: 'number' },
          { name: 'teachers_trained_curr', label: 'Number of Sabbath school teachers trained (Current Q)', type: 'number' },
          { name: 'integrated_mission_prev', label: 'Number of integrated mission projects (Previous Q)', type: 'number' },
          { name: 'integrated_mission_curr', label: 'Number of integrated mission projects (Current Q)', type: 'number' },
          { name: 'observations_challenges_uths', label: 'Observations/Challenges', type: 'textarea' },
        ]
      },
      {
        title: 'MISSION FOR ALL',
        fields: [
          { name: 'branch_ss', label: 'Number of Branch Sabbath schools', type: 'number' },
          { name: 'ss_class_units', label: 'Number of SS Class Units', type: 'number' },
          { name: 'members_in_mission', label: 'Number of members involved in Mission (GTMI)', type: 'number' },
          { name: 'literature_distributed_mfa', label: 'Number of Literature Distributed', type: 'number' },
          { name: 'ss_rallies', label: 'Number of Sabbath School Rallies held', type: 'number' },
          { name: 'helped_needy', label: 'Number of people who helped the needy', type: 'number' },
          { name: 'observations_challenges_mfa', label: 'Observations/Challenges', type: 'textarea' },
        ]
      },
      {
        title: '',
        fields: [
          { name: 'prepared_by', label: 'Prepared by (Name & Signature)', type: 'auto_name', required: true },
          { name: 'prepared_signature', label: 'Signature', type: 'text' },
          { name: 'reviewed_by', label: 'Reviewed by (Pastor)', type: 'text' },
          { name: 'reviewed_signature', label: 'Signature', type: 'text' },
          { name: 'approved_by', label: 'Approved by (SSPM Director)', type: 'text' },
          { name: 'approved_signature', label: 'Signature', type: 'text' },
          { name: 'date_submitted', label: 'Date Submitted', type: 'date', required: true },
        ]
      }
    ]
  },

  family_life: {
    sections: [
      {
        title: '',
        fields: [
          { name: 'conference_field', label: 'CONFERENCE/FIELD', type: 'text', required: true },
          { name: 'quarter_ending', label: 'QUARTER ENDING', type: 'text', required: true },
          { name: 'date_reported', label: 'DATE REPORTED', type: 'date', required: true },
          { name: 'director', label: 'DIRECTOR', type: 'text' },
          { name: 'president', label: 'PRESIDENT', type: 'text' },
        ]
      },
      {
        title: 'STATISTICS',
        fields: [
          { name: 'newly_married_both_adventist', label: '1.1 Newly married couples this quarter where both are Adventist', type: 'number' },
          { name: 'newly_married_woman_non_adventist', label: '1.2 Newly married couples this quarter where a woman is non-Adventist', type: 'number' },
          { name: 'newly_married_man_non_adventist', label: '1.3 Newly married couples this quarter where a man is non-Adventist', type: 'number' },
          { name: 'newly_married_total', label: '1.4 Total number of newly married couples this quarter', type: 'number' },
          { name: 'divorced_female', label: '2.1 Number of divorced female members this quarter', type: 'number' },
          { name: 'divorced_male', label: '2.2 Number of divorced male members this quarter', type: 'number' },
          { name: 'divorced_total', label: '2.3 Total number of divorced members this quarter', type: 'number' },
          { name: 'widowed_women', label: '3.1 Number of widowed women this quarter', type: 'number' },
          { name: 'widowed_men', label: '3.2 Number of widowed men this quarter', type: 'number' },
          { name: 'widowed_total', label: '3.3 Total number of widows', type: 'number' },
          { name: 'single_men', label: '4.1 Number of single men (Not married before)', type: 'number' },
          { name: 'single_women', label: '4.2 Number of single women (Not married before)', type: 'number' },
          { name: 'single_total', label: '4.3 Total number of singles (Not married before)', type: 'number' },
          { name: 'single_parents_male', label: '5.1 Number of male single parents (Not married before)', type: 'number' },
          { name: 'single_parents_female', label: '5.2 Number of female single parents (Not married before)', type: 'number' },
          { name: 'single_parents_total', label: '5.3 Total number of single parents (Not married before)', type: 'number' },
          { name: 'orphaned_this_quarter', label: '6.1 Number of orphaned children this quarter', type: 'number' },
          { name: 'orphaned_total', label: '6.2 Total number of orphaned children', type: 'number' },
          { name: 'dependent_children_with_parents', label: '6.3 Number of dependent children below age 18 living with parents', type: 'number' },
          { name: 'dependent_children_child_headed', label: '6.4 Number of children below age 18 in child-headed homes', type: 'number' },
        ]
      },
      {
        title: 'COMMUNION WITH GOD',
        fields: [
          { name: 'family_worship', label: '1. Number of families having regular family worship', type: 'number' },
          { name: 'read_adventist_home', label: '2. Number of families reading Adventist Home, MYP and CG', type: 'number' },
          { name: 'prayer_seminars', label: '3. Number of seminars conducted dealing with prayer and study of the word', type: 'number' },
        ]
      },
      {
        title: 'IDENTITY IN CHRIST',
        fields: [
          { name: 'afm_counsellors_trained_this_q', label: '1. Number of trained Adventist Family Ministries counsellors this quarter', type: 'number' },
          { name: 'afm_counsellors_total', label: '2. Total number of trained Adventist Family Ministries counsellors', type: 'number' },
          { name: 'singles_seminars', label: '3. Number of seminars for singles conducted', type: 'number' },
          { name: 'marriage_enriching_seminars', label: '4. Number of marriage enriching seminars conducted', type: 'number' },
          { name: 'blended_family_seminars', label: '5. Number of seminars on blended families conducted', type: 'number' },
          { name: 'divorce_seminars', label: '6. Number of seminars on divorce and families conducted', type: 'number' },
          { name: 'widow_seminars', label: '7. Number of seminars for widows and widowers conducted', type: 'number' },
          { name: 'pre_marital_counselling_couples', label: '8. Number of couples involved in pre-marital counselling', type: 'number' },
          { name: 'marital_counselling_couples', label: '9. Number of couples in marital counselling', type: 'number' },
          { name: 'psycho_social_counselling_members', label: '10. Number of individual members who received psycho-social counselling', type: 'number' },
          { name: 'family_week_emphasis', label: '11. Number of churches that conducted the Family Week Emphasis', type: 'number' },
          { name: 'health_seminars', label: '12. Number of seminars dealing with physical and mental health conducted', type: 'number' },
        ]
      },
      {
        title: 'UNITY THROUGH THE HOLY SPIRIT',
        fields: [
          { name: 'cultural_activities', label: '1. Number of cultural activities carried out, fostering unity and fellowship', type: 'number' },
          { name: 'couples_reach_out', label: '2. Number of couples who conducted reach out projects with their friends', type: 'number' },
          { name: 'teenage_seminars', label: '3. Number of seminars and outreach projects addressing teenage issues', type: 'number' },
          { name: 'abuse_centers', label: '4. Number of Abuse centers available in your Conference', type: 'number' },
          { name: 'afm_leaders_trained', label: '5. Number of trained Adventist Family Ministries leaders', type: 'number' },
          { name: 'afm_resource_materials', label: '6. Number of churches with Adventist Family Ministries resource materials', type: 'number' },
          { name: 'afm_groupings', label: '7. Number of churches with established AFM groupings of church members', type: 'number' },
        ]
      },
      {
        title: 'MISSION FOR ALL',
        fields: [
          { name: 'couples_praying_with_non_sda', label: '1. Number of couples praying with non-SDA couples', type: 'number' },
          { name: 'families_reach_projects_community', label: '2. Number of families that conducted reach projects with their communities', type: 'number' },
          { name: 'families_visited_grieving', label: 'Number of families who visited the grieving in the neighborhood', type: 'number' },
          { name: 'senior_citizens_reach_out', label: '3. Number of senior citizens reach out projects conducted', type: 'number' },
          { name: 'family_life_campaigns', label: '4. Number of Family Life seminars/campaigns carried out to reach population groups', type: 'number' },
          { name: 'lgbtq_awareness_seminars', label: '5. Number of awareness seminars on LGBTQ conducted', type: 'number' },
        ]
      },
      {
        title: 'OTHER ACTIVITIES',
        fields: [
          { name: 'other_activities', label: 'Other Activities', type: 'textarea' },
        ]
      },
      {
        title: '',
        fields: [
          // Optional footer fields if needed; not present in original form but we'll add for consistency
        ]
      }
    ]
  },

  apm: {
    sections: [
      {
        title: '',
        fields: [
          { name: 'conference_field', label: 'Conference/Field', type: 'text', required: true },
          { name: 'director', label: 'Director', type: 'text' },
          { name: 'quarter_ending', label: 'Quarter Ending', type: 'text', required: true },
          { name: 'president', label: 'President', type: 'text' },
          { name: 'submission_date', label: 'Submission Date', type: 'date', required: true },
        ]
      },
      {
        title: 'STATISTICS',
        fields: [
          { name: 'blindness', label: 'a) Blindness', type: 'number' },
          { name: 'deafness', label: 'b) Deafness', type: 'number' },
          { name: 'physically_challenged', label: 'c) Physically Challenged', type: 'number' },
          { name: 'emotionally_mentally_challenged', label: 'd) Emotionally and Mentally Challenged', type: 'number' },
          { name: 'orphans_vulnerable', label: 'e) Orphans and Vulnerable Children', type: 'number' },
          { name: 'widowhood', label: 'f) Widowhood', type: 'number' },
          { name: 'caregivers', label: 'g) Caregivers', type: 'number' },
          { name: 'albinism_vitiligo', label: 'h) Albinism/Vitiligo', type: 'number' },
          { name: 'total_apm_members', label: '2. Total number of APM members', type: 'number' },
          { name: 'apm_leaders', label: '3. Number of APM leaders', type: 'number' },
          { name: 'local_conferences_reporting', label: '4. Number of local conferences/field reporting', type: 'number' },
          { name: 'mission_districts_reporting', label: '5. Number of mission districts reporting', type: 'number' },
          { name: 'churches_reporting', label: '6. Number of churches reporting', type: 'number' },
        ]
      },
      {
        title: 'COMMUNION WITH GOD',
        fields: [
          { name: 'apm_camp_meetings', label: '1. Number of APM camp meetings held', type: 'number' },
          { name: 'apm_weeks_prayer', label: '2. Number of APM Weeks of Prayer conducted', type: 'number' },
          { name: 'prayer_experience_sharing', label: '3. Number of prayer or experience sharing programs held', type: 'number' },
        ]
      },
      {
        title: 'IDENTITY IN CHRIST',
        fields: [
          { name: 'apm_baptisms_this_q', label: '1. Number of APM baptisms this quarter', type: 'number' },
          { name: 'apm_baptized_total', label: '2. Total number of baptized APM members', type: 'number' },
          { name: 'apm_daily_devotional', label: '3. Number of APM members following daily devotional readings', type: 'number' },
          { name: 'apm_doctrines_learned', label: '4. Number of APM members who have learnt the SDA doctrines', type: 'number' },
        ]
      },
      {
        title: 'UNITY THROUGH THE HOLY SPIRIT',
        fields: [
          { name: 'apm_members_local_programs', label: '1. Number of APM members that participated in local church programs', type: 'number' },
          { name: 'apm_rallies', label: '2. Number of APM Rallies conducted', type: 'number' },
          { name: 'apm_training_programs', label: '3. Number of training programs conducted for APM leaders', type: 'number' },
          { name: 'apm_advisories', label: '4. Number of APM advisories held', type: 'number' },
          { name: 'apm_awareness_seminars', label: '5. Number of APM awareness seminars held for the church', type: 'number' },
        ]
      },
      {
        title: 'MISSION FOR ALL',
        fields: [
          { name: 'apm_new_members_mission', label: '1. How many new APM members got involved in mission this quarter', type: 'number' },
          { name: 'apm_members_in_mission', label: '2. Total number of APM members involved in mission', type: 'number' },
          { name: 'apm_equipping_seminars', label: '3. Number of equipping seminars/workshops held for APM members', type: 'number' },
          { name: 'sign_language_training', label: '4. Number of sign language interpreters\' training programs held', type: 'number' },
          { name: 'caregiver_training', label: '5. Number of APM training programs conducted for care givers', type: 'number' },
        ]
      },
      {
        title: 'EXPERIENCES',
        fields: [
          { name: 'experiences', label: 'Report of Special APM Experiences/Testimonies (max 1 page)', type: 'textarea' },
        ]
      },
      {
        title: '',
        fields: [
          { name: 'reported_by', label: 'Reported by', type: 'auto_name', required: true },
          { name: 'church', label: 'Church', type: 'text' },
        ]
      }
    ]
  },

  ministerial: {
    sections: [
      {
        title: '',
        fields: [
          { name: 'local_conference', label: 'NAME OF LOCAL CONFERENCE', type: 'text', required: true },
          { name: 'quarter_year', label: 'QUARTER/YEAR REPORTED', type: 'text', required: true },
          { name: 'director', label: 'DIRECTOR', type: 'text' },
          { name: 'date_submitted', label: 'DATE SUBMITTED', type: 'date', required: true },
          { name: 'president', label: 'PRESIDENT', type: 'text' },
        ]
      },
      {
        title: 'STATISTICS',
        fields: [
          { name: 'ordained_pastors', label: '1.1 Number of ordained pastors in the Conference', type: 'number' },
          { name: 'licensed_pastors', label: '1.2 Number of licenced pastors in the Conference', type: 'number' },
          { name: 'total_serving_pastors', label: '1.3 Total number of serving pastors', type: 'number' },
          { name: 'pastors_ordained_this_q', label: '1.4 Number of pastors ordained this quarter', type: 'number' },
          { name: 'pastors_married_this_q', label: '1.5 Number of pastors married this quarter', type: 'number' },
          { name: 'total_married_pastors', label: '1.6 Total number of married pastors', type: 'number' },
          { name: 'pastors_retired_this_q', label: '2.1 Number of pastors retired this quarter', type: 'number' },
          { name: 'total_retired_pastors', label: '2.2 Total number of retired pastors', type: 'number' },
          { name: 'retired_pastors_deceased', label: '2.3 Number of retired pastors deceased this quarter', type: 'number' },
          { name: 'serving_pastors_lost_by_death', label: '3.0 Serving pastors lost this quarter - By death', type: 'number' },
          { name: 'serving_pastors_lost_apostasy', label: 'By apostasy/dismissal', type: 'number' },
          { name: 'serving_pastors_lost_termination', label: 'By termination/resignation', type: 'number' },
          { name: 'pastors_ba_deg', label: '4.1 Number of pastors with BA', type: 'number' },
          { name: 'pastors_ma_deg', label: '4.2 Number of pastors with MA', type: 'number' },
          { name: 'pastors_dmin_phd_deg', label: '4.3 Number of pastors with DMin/PhD', type: 'number' },
          { name: 'pastors_studying_ba', label: '5.1 Number of pastors pursuing studies at BA level', type: 'number' },
          { name: 'pastors_studying_ma', label: '5.2 Number of pastors pursuing studies at MA level', type: 'number' },
          { name: 'pastors_studying_dmin', label: '5.3 Number of pastors pursuing studies at DMin/PhD level', type: 'number' },
          { name: 'pastors_continuing_ed', label: '5.4 Number of pastors doing Continuing Education', type: 'number' },
          { name: 'interns_under_supervisors', label: '6.1 Number of interns under supervisors', type: 'number' },
          { name: 'untrained_pastors', label: '6.2 Number of untrained pastors currently serving', type: 'number' },
          { name: 'chaplains_military', label: '6.3 Number of pastors serving as chaplains - Military', type: 'number' },
          { name: 'chaplains_medical', label: 'Medical institutions', type: 'number' },
          { name: 'pastors_mentored', label: '7.1 Number of pastors being mentored', type: 'number' },
          { name: 'pastors_commissioners_oaths', label: '8.1 Number of pastors authorised as commissioners of oaths', type: 'number' },
          { name: 'pastors_receiving_ministry_mag', label: '9.1 Number of pastors receiving Ministry Magazine (Soft or hard copy)', type: 'number' },
          { name: 'non_adventist_pastors_receiving_mag', label: '9.2 Number of non-Adventist pastors receiving Ministry Magazine', type: 'number' },
          { name: 'pastors_received_devotional_books', label: '9.3 Pastors who received the "Dollar Book" and/or other devotional books this quarter', type: 'number' },
          { name: 'pastors_visited', label: '10.1 Number of pastors visited this quarter', type: 'number' },
          { name: 'pastors_appreciated', label: '10.2 Number of pastors appreciated this quarter', type: 'number' },
          { name: 'pastors_appreciated_day', label: '10.3 Pastors appreciated on Pastor\'s Appreciation Day (Second Sabbath of October)', type: 'number' },
          { name: 'ministerial_spouses_serving', label: '11.0 Number of ministerial spouses of serving pastors', type: 'number' },
          { name: 'ministerial_spouses_retirees', label: '11.1 Number of ministerial spouses of retirees', type: 'number' },
          { name: 'ministerial_spouses_widowed', label: '11.2 Number of widowed ministerial spouses', type: 'number' },
          { name: 'ministerial_spouses_total', label: '11.3 Total number of ministerial spouses', type: 'number' },
          { name: 'ministerial_spouses_journal', label: '11.4 Number of ministerial spouses receiving "The Journal" (Electronic or hard copy)', type: 'number' },
          { name: 'ministerial_spouses_mentored', label: '11.5 Number of ministerial spouses being mentored', type: 'number' },
          { name: 'total_church_elders', label: '12.0 Total number of serving church elders', type: 'number' },
          { name: 'elders_ordained_this_q', label: '12.1 Number of church elders ordained this quarter', type: 'number' },
          { name: 'elders_receiving_digest', label: '12.2 Number of elders receiving Elder\'s Digest (Electronic or hard copy)', type: 'number' },
          { name: 'elders_with_handbook', label: '12.3 Number of elders with the Elders\' Handbook', type: 'number' },
          { name: 'serving_deacons', label: '13.1 Number of serving deacons', type: 'number' },
          { name: 'serving_deaconesses', label: '13.2 Number of serving deaconesses', type: 'number' },
          { name: 'seminars_for_elders', label: '14.0 Number of seminars conducted - For elders', type: 'number' },
          { name: 'seminars_for_deacons', label: 'For deacons and deaconesses', type: 'number' },
          { name: 'strategic_priority_promotions', label: '15. Number of promotions of the four strategic priority areas', type: 'number' },
          { name: 'bible_conferences', label: '16.1 Number of Bible Conferences/Colloquia held', type: 'number' },
          { name: 'ministerial_leadership_seminars', label: '16.2 Number of ministerial and leadership seminars/conferences held', type: 'number' },
          { name: 'ministerial_spouses_seminars', label: '16.3 Number of ministerial spouses seminars/conferences held', type: 'number' },
          { name: 'evangelism_campaigns_pastors', label: '17.0 Number of evangelism campaigns conducted by pastors', type: 'number' },
          { name: 'souls_won_by_pastors', label: '17.1 Number of souls won by pastors', type: 'number' },
          { name: 'baptisms_by_pastors', label: '17.2 Number of souls baptised from evangelism campaigns conducted by pastors', type: 'number' },
          { name: 'evangelism_campaigns_spouses', label: '18.0 Number of evangelism campaigns conducted by ministerial spouses', type: 'number' },
          { name: 'souls_won_by_spouses', label: '18.1 Number of souls won by ministerial spouses', type: 'number' },
          { name: 'baptisms_by_spouses', label: '18.2 Number of souls baptised from evangelism campaigns conducted by ministerial spouses', type: 'number' },
        ]
      },
      {
        title: 'COMMUNION WITH GOD',
        fields: [
          { name: 'cw_churches_disciple_curriculum', label: '1. How many churches are implementing the discipleship curriculum?', type: 'number' },
          { name: 'cw_churches_weekly_prayer', label: '2. How many churches conducted the weekly prayer meetings this quarter?', type: 'number' },
          { name: 'cw_prayer_initiatives', label: '3. How many prayer initiatives were conducted this quarter?', type: 'number' },
          { name: 'cw_pastors_trained_spiritual', label: '4. How many pastors underwent training in spiritual growth?', type: 'number' },
          { name: 'cw_elders_trained_spiritual', label: '5. How many elders underwent training in spiritual growth?', type: 'number' },
          { name: 'cw_prayer_networks', label: '6. How many churches are running functional prayer networks?', type: 'number' },
        ]
      },
      {
        title: 'IDENTITY IN CHRIST',
        fields: [
          { name: 'ic_churches_doctrinal_classes', label: '1. Number of churches that conducted doctrinal classes for all age groups this quarter', type: 'number' },
          { name: 'ic_doctrinal_resources_produced', label: '2. Number of doctrinal or heritage resources produced and distributed this quarter', type: 'number' },
          { name: 'ic_new_baptized_nurtured', label: '3. Number of newly baptized members completing post-baptism nurture programs', type: 'number' },
          { name: 'ic_doctrinal_training', label: '4. Number of doctrinal training programs held', type: 'number' },
        ]
      },
      {
        title: 'UNITY THROUGH THE HOLY SPIRIT',
        fields: [
          { name: 'uhs_certified_pastors', label: '1. Certified following leadership training - Pastors', type: 'number' },
          { name: 'uhs_certified_elders', label: '- Church elders', type: 'number' },
          { name: 'uhs_certified_deacons', label: '- Deacons', type: 'number' },
          { name: 'uhs_certified_deaconesses', label: '- Deaconesses', type: 'number' },
          { name: 'uhs_attended_pastors', label: '2. Attended leadership training - Pastors', type: 'number' },
          { name: 'uhs_attended_elders', label: '- Church elders', type: 'number' },
          { name: 'uhs_attended_deacons', label: '- Deacons', type: 'number' },
          { name: 'uhs_attended_deaconesses', label: '- Deaconesses', type: 'number' },
          { name: 'uhs_districts_submitted_reports', label: '3. How many districts submitted quarterly reports?', type: 'number' },
          { name: 'uhs_inter_departmental_programs', label: '4. How many inter-departmental programs were conducted in mission districts?', type: 'number' },
          { name: 'uhs_total_baptisms', label: '5. Number of people baptized this quarter', type: 'number' },
          { name: 'uhs_total_member_involvement', label: '6. Number of church members participating in "Total Member Involvement."', type: 'number' },
          { name: 'uhs_digital_evangelism', label: '7. Number of "Digital Evangelism" engagements', type: 'number' },
          { name: 'uhs_youth_children_evangelism', label: '8. Number of youths and children participating in evangelism.', type: 'number' },
        ]
      },
      {
        title: 'MISSION FOR ALL',
        fields: [
          { name: 'mfa_seminars_pastors', label: '1. Number of seminars conducted for pastors this quarter', type: 'number' },
          { name: 'mfa_seminars_elders', label: '2. Number of seminars conducted for elders this quarter', type: 'number' },
          { name: 'mfa_seminars_deacons', label: '3. Number of seminars conducted for deacons/deaconesses this quarter', type: 'number' },
        ]
      },
      {
        title: '',
        fields: [
          { name: 'date_received', label: 'DATE RECEIVED', type: 'date' },
          { name: 'director_signature', label: 'Director:', type: 'text' },
          { name: 'president_signature', label: 'President:', type: 'text' },
        ]
      }
    ]
  },

  youth: {
    sections: [
      {
        title: '',
        fields: [
          { name: 'quarter_ending', label: 'Quarter Ending', type: 'text', required: true },
          { name: 'year', label: 'Year', type: 'text', required: true },
          { name: 'district_church', label: 'District/Church Reporting', type: 'district_select', required: true },
          { name: 'reported_by', label: 'Reported by', type: 'auto_name', required: true },
        ]
      },
      {
        title: 'STATISTICS',
        fields: [
          { name: 'young_adult_societies', label: 'No. Young Adult Societies', type: 'number' },
          { name: 'young_adult_membership_22_30', label: 'Young Adult Membership (22-30 yrs)', type: 'number' },
          { name: 'young_adult_membership_30plus', label: 'Young Adult Membership (30 yrs +)', type: 'number' },
          { name: 'ambassador_clubs', label: 'No. Ambassador Clubs', type: 'number' },
          { name: 'ambassador_membership', label: 'Ambassador Membership', type: 'number' },
          { name: 'pathfinder_clubs', label: 'No. Pathfinder clubs', type: 'number' },
          { name: 'pathfinder_membership', label: 'Pathfinder Membership', type: 'number' },
          { name: 'adventurer_clubs', label: 'No. Adventurer clubs', type: 'number' },
          { name: 'adventurer_membership', label: 'Adventurer Membership', type: 'number' },
          { name: 'master_guide_classes', label: 'No. Master Guide Classes', type: 'number' },
          { name: 'invested_master_guides', label: 'No. of Invested Master Guides', type: 'number' },
          { name: 'syl_classes', label: 'No. SYL Classes', type: 'number' },
          { name: 'syl_invested', label: 'No. of SYL Invested', type: 'number' },
          { name: 'pcm_branches', label: 'PCM Branches', type: 'number' },
          { name: 'pcm_members', label: 'PCM Members', type: 'number' },
          { name: 'cmt_classes', label: 'CMT Classes', type: 'number' },
          { name: 'cmt_awarded_leaders', label: 'CMT Awarded leaders', type: 'number' },
          { name: 'one_year_mission_team', label: 'One Year in Mission Team', type: 'number' },
          { name: 'voice_of_youth_teams', label: 'Voice of Youth Teams', type: 'number' },
        ]
      },
      {
        title: 'INNOVATIVE EVANGELISM - Total Youth Involvement',
        fields: [
          { name: 'outreach_activities', label: '1. No of evangelistic/outreach Activities', type: 'number' },
          { name: 'mission_activities_financial', label: '2. No. of mission activities and projects financially supported by the church', type: 'number' },
          { name: 'youths_involved', label: '3. No. of Youths Involved', type: 'number' },
          { name: 'mission_sabbaths', label: '4. No. of Mission Sabbaths conducted', type: 'number' },
        ]
      },
      {
        title: 'INNOVATIVE EVANGELISM - OYiM/VOY/Caleb Projects',
        fields: [
          { name: 'oyim_recruited_trained', label: '5. No. of Youths recruited & trained', type: 'number' },
          { name: 'skills_training_activities', label: '6. No. of Skills Training & other activities done', type: 'number' },
          { name: 'vop_graduates', label: '7. No. of VOP Graduates/Truthlink', type: 'number' },
        ]
      },
      {
        title: 'INNOVATIVE EVANGELISM - Youth Outreach in Unreached Areas',
        fields: [
          { name: 'unreached_areas_identified', label: '8. No. of areas identified as Unreached', type: 'number' },
          { name: 'unreached_areas_reached', label: '9. No. of those areas Reached/Public Campuses Reached', type: 'number' },
          { name: 'health_expositions', label: '10. No. of Health Expositions conducted on or outside campuses', type: 'number' },
          { name: 'pcm_evangelism_campaigns', label: '11. No. of PCM evangelistic campaigns conducted', type: 'number' },
          { name: 'community_pathfinder_activities', label: '12. No. of Community Pathfinder Club activities done', type: 'number' },
          { name: 'baptisms_mission_activities', label: '13. Baptisms from Mission Activities', type: 'number' },
          { name: 'youths_literature_evangelism_honor', label: '14. No. of Youths who earned an honor in Literature Evangelism', type: 'number' },
          { name: 'youths_le_practicum', label: '15. No. of Youths who fulfilled the LE Practicum in the Conference', type: 'number' },
        ]
      },
      {
        title: 'COMMUNION WITH GOD',
        fields: [
          { name: 'youths_sop_books', label: '1. No. of Youths that study Spirit of Prophecy Books', type: 'number' },
          { name: 'youths_ss_guides', label: '2. No. of Youths with Sabbath School Study Guides', type: 'number' },
          { name: 'youths_stewardship_honor', label: '3. No. of youths who earned an honor in Stewardship', type: 'number' },
          { name: 'youths_reclaimed', label: '4. No. of Youths reclaimed through direct influence of the youths', type: 'number' },
        ]
      },
      {
        title: 'IDENTITY IN CHRIST',
        fields: [
          { name: 'youth_virtual_doctrinal', label: '1. No. of Youth virtual doctrinal meetings (28 Fundamental Beliefs studies)', type: 'number' },
          { name: 'youth_doctrinal_videos', label: '2. No. of short Youth doctrinal videos produced and shared', type: 'number' },
          { name: 'youths_exploring_heritage', label: '3. No. of Youths Exploring the Book Church Heritage', type: 'number' },
          { name: 'ays_health_emphasis', label: '4. No. of AYS Health emphasis programs carried out', type: 'number' },
          { name: 'youth_marriage_retreats', label: '5. No. of Youth marriage retreats or marriage seminars/workshops conducted', type: 'number' },
        ]
      },
      {
        title: 'UNITY THROUGH THE HOLY SPIRIT',
        fields: [
          { name: 'inter_conference_retreats', label: '1. No. of Inter-conference retreats or conferences', type: 'number' },
          { name: 'youth_music_fellowships', label: '2. No. of Youth music fellowships', type: 'number' },
          { name: 'youth_alive_friendship_groups', label: '3. No. of Youth Alive Friendship Groups (FGs) established this quarter', type: 'number' },
        ]
      },
      {
        title: 'OTHER',
        fields: [
          { name: 'youths_leadership_roles', label: '1. No. of Youths involved in leadership roles', type: 'number' },
          { name: 'youths_samuel_project', label: '2. No. of Youths involved in the Samuel Project', type: 'number' },
          { name: 'leadership_seminars', label: '3. No. of Leadership Seminars Conducted', type: 'number' },
        ]
      },
      {
        title: '',
        fields: [
          { name: 'challenges', label: 'Challenges', type: 'textarea' },
          { name: 'achievements', label: 'Achievements', type: 'textarea' },
          { name: 'recommendations', label: 'Recommendations', type: 'textarea' },
        ]
      }
    ]
  },

  music: {
    sections: [
      {
        title: '',
        fields: [
          { name: 'district_church', label: 'District/Church reporting', type: 'district_select', required: true },
          { name: 'quarter_ending', label: 'Quarter ending', type: 'text', required: true },
        ]
      },
      {
        title: 'A. General statistics',
        fields: [
          { name: 'churches_reporting', label: '1. No churches reporting this quarter', type: 'number' },
          { name: 'church_choirs', label: '2. No of church choirs in the district', type: 'number' },
          { name: 'churches_with_choirs', label: '3. No of churches with church choirs', type: 'number' },
          { name: 'choir_members', label: '4. No of choir members', type: 'number' },
          { name: 'singing_groups', label: '5. No of singing groups in the local church(es)', type: 'number' },
          { name: 'singing_groups_membership', label: '6. Membership of these singing groups', type: 'number' },
          { name: 'soloists', label: '8. No of Soloists in the local church', type: 'number' },
          { name: 'music_teachers', label: '7. No of teachers of music in the local church', type: 'number' },
        ]
      },
      {
        title: 'B. Communion with God',
        fields: [
          { name: 'worship_music_seminars', label: '1. How many worship and music seminars/workshops conducted this quarter', type: 'number' },
          { name: 'singers_personal_devotional', label: '2. How many singers have daily personal devotional life', type: 'number' },
          { name: 'singers_ss_guides_daily', label: '3. How many singers study the Sabbath School Study Guides daily', type: 'number' },
          { name: 'singers_bible_reading_plan', label: '4. How many follow the daily Bible reading plan', type: 'number' },
        ]
      },
      {
        title: 'C. Identity in Christ',
        fields: [
          { name: 'music_leadership_trainings', label: '1. Leadership trainings conducted for music leaders in the district', type: 'number' },
          { name: 'stewardship_leaders_appointed', label: '2. How many stewardship leaders appointed in the singing groups', type: 'number' },
          { name: 'other_trainings_music_leaders', label: '3. Any others trainings for music leaders done', type: 'number' },
          { name: 'singers_church_leaders', label: '4. Singers who are church leaders/elders/church clerks/treasurers etc.', type: 'number' },
          { name: 'singers_church_board_members', label: '5. How many singers are church board members', type: 'number' },
          { name: 'singers_tithe_returners', label: '6. How many singers are tithe/offering returners in the district', type: 'number' },
        ]
      },
      {
        title: 'D. Unity through the Holy Spirit',
        fields: [
          { name: 'inter_conference_rallies', label: '1. How many inter conference rallies/camp participated in', type: 'number' },
          { name: 'fellowship_groups', label: '2. How many fellowship groups do you have in the district', type: 'number' },
          { name: 'fellowship_activities', label: '3. How many fellowship activities did you have this quarter', type: 'number' },
          { name: 'music_rallies', label: '4. Music rallies conducted this quarter', type: 'number' },
          { name: 'music_camps_festivals', label: '5. Music camps/festivals conducted this quarter', type: 'number' },
          { name: 'album_launches', label: '6. Album launches in the district individual/choirs/singing groups', type: 'number' },
        ]
      },
      {
        title: 'E. Innovative Evangelism',
        fields: [
          { name: 'evangelistic_seminars_singers', label: '1. Evangelistic seminar/workshops conducted by singers', type: 'number' },
          { name: 'evangelistic_crusades', label: '2. Evangelistic crusades, efforts were conducted in the conference', type: 'number' },
          { name: 'community_services_singers', label: '3. How many community services were done by singers', type: 'number' },
          { name: 'spent_to_help_needy', label: '4. How much was spent to help the needy groups (monetary form)', type: 'number' },
          { name: 'prison_ministry', label: '5i. Prison ministry/visitation', type: 'number' },
          { name: 'hospital_ministry', label: '5ii. Hospital ministry/visitation', type: 'number' },
          { name: 'singers_participated_evangelism', label: '6. How many singers participated in evangelistic activities', type: 'number' },
          { name: 'worship_groups_established', label: '7. Worshiping groups e.g., branches, companies established', type: 'number' },
          { name: 'musicians_preaching_evangelists', label: '8. Musicians who are preaching evangelists in the local church', type: 'number' },
        ]
      },
      {
        title: '',
        fields: [
          { name: 'reported_by', label: 'Reported by', type: 'auto_name', required: true },
          { name: 'pastor_signature', label: 'Pastor\'s signature', type: 'text' },
        ]
      }
    ]
  },

  chaplaincy: {
    sections: [
      {
        title: '',
        fields: [
          { name: 'quarter_ending', label: 'Quarter Ending', type: 'text', required: true },
          { name: 'year', label: 'Year', type: 'text', required: true },
          { name: 'district_church', label: 'District/Church Reporting', type: 'district_select', required: true },
          { name: 'reported_by', label: 'Reported by', type: 'auto_name', required: true },
        ]
      },
      {
        title: 'STATISTICS',
        fields: [
          { name: 'adventist_chaplains_denom', label: 'No. of Adventist Chaplains in denominational institutions', type: 'number' },
          { name: 'adventist_chaplains_non_denom', label: 'No. of Adventist Chaplains in non-denominational institutions', type: 'number' },
          { name: 'chaplains_campus', label: 'Chaplains under: Campus', type: 'number' },
          { name: 'chaplains_military', label: 'Military', type: 'number' },
          { name: 'chaplains_healthcare', label: 'Health Care', type: 'number' },
          { name: 'chaplains_corrections', label: 'Corrections', type: 'number' },
          { name: 'chaplains_community', label: 'Community', type: 'number' },
          { name: 'chaplains_workplace', label: 'Work Place', type: 'number' },
          { name: 'chaplains_affirmed', label: 'Chaplains: Affirmed', type: 'number' },
          { name: 'chaplains_inducted', label: 'Inducted', type: 'number' },
          { name: 'chaplains_endorsed', label: 'Endorsed', type: 'number' },
          { name: 'chaplains_ordained', label: 'Ordained', type: 'number' },
        ]
      },
      {
        title: 'INNOVATIVE EVANGELISM',
        fields: [
          { name: 'chaplaincy_evangelism_seminars', label: '1. No. of Chaplaincy Seminars conducted on evangelism', type: 'number' },
          { name: 'chaplains_personal_outreach', label: '2. No. of Chaplains participating in personal outreach initiatives', type: 'number' },
          { name: 'chaplains_public_evangelism', label: '3. No. of Chaplains involved in public evangelistic campaigns', type: 'number' },
          { name: 'baptisms_chaplaincy', label: '4. No. of Baptisms realized from the above missions', type: 'number' },
          { name: 'chaplains_non_adventist_involved', label: '5. Chaplains in Non-Adventist Institutions involved in mission work', type: 'number' },
        ]
      },
      {
        title: 'COMMUNION WITH GOD',
        fields: [
          { name: 'chaplains_believe_his_prophets', label: '1. Chaplains following the \'Believe His prophets\' daily reading plan', type: 'number' },
          { name: 'chaplains_ss_guides', label: '2. No. of Chaplains with Sabbath School Study Guides', type: 'number' },
          { name: 'stewardship_seminars_public_campuses', label: '3. No. of Stewardship Seminars conducted in Public Campuses', type: 'number' },
          { name: 'health_expos_public_campuses', label: '4. No. of Health Expos conducted in Public Campuses', type: 'number' },
        ]
      },
      {
        title: 'IDENTITY IN CHRIST',
        fields: [
          { name: 'continuing_education_seminars', label: '1. Continuing Education Seminars conducted for Chaplaincy and Pastors', type: 'number' },
          { name: 'clinical_pastoral_education', label: '2. Clinical Pastoral Education courses offered by SID ACM', type: 'number' },
          { name: 'pastors_chaplains_endorsed', label: '3. Pastors and Chaplains endorsed this quarter', type: 'number' },
          { name: 'chaplains_theology_degrees', label: '4. Chaplains with Theology degrees from the Adventist Theological Seminars', type: 'number' },
          { name: 'bible_studies_conducted', label: '5. No. of Bible Studies conducted', type: 'number' },
        ]
      },
      {
        title: 'UNITY THROUGH THE HOLY SPIRIT',
        fields: [
          { name: 'visitations_other_campuses', label: '1. No. of visitations to other Campuses', type: 'number' },
          { name: 'leadership_seminars_chaplaincy', label: '2. No. of Leadership Seminars conducted', type: 'number' },
          { name: 'spiritual_gifts_seminars', label: '3. No. of Spiritual Gifts seminars or Spiritual Gifts Inventory programs', type: 'number' },
          { name: 'collaborative_ventures', label: '4. No. of collaborative ventures held', type: 'number' },
        ]
      },
      {
        title: '',
        fields: [
          { name: 'challenges', label: 'Challenges', type: 'textarea' },
          { name: 'achievements', label: 'Achievements', type: 'textarea' },
          { name: 'recommendations', label: 'Recommendations', type: 'textarea' },
        ]
      }
    ]
  }
};

export default reportSchemas;