import { Dockest, logLevel, defaultHealthchecks } from 'dockest'

const dockest = new Dockest({
  composeFile: ['docker-compose-redis.yml', 'docker-compose-postgres.yml'],
  dumpErrors: true,
  logLevel: logLevel.DEBUG,
})

dockest.run([
  {
    serviceName: 'multiple_compose_files_postgres',
    commands: [
      'sequelize db:migrate:undo:all',
      'sequelize db:migrate',
      'sequelize db:seed:undo:all',
      'sequelize db:seed --seed 20190101001337-demo-user',
    ],
    healthchecks: [defaultHealthchecks.postgres],
  },

  { serviceName: 'multiple_compose_files_redis' },
])
