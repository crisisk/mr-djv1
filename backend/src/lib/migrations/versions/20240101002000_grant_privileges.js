exports.up = async (knex) => {
  await knex.raw('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO mrdj_user');
  await knex.raw('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO mrdj_user');
};

exports.down = async (knex) => {
  await knex.raw('REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM mrdj_user');
  await knex.raw('REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM mrdj_user');
};
