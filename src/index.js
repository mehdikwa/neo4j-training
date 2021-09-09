const Neo4jClient = require('neo4j-driver').v1;

const datasources = {
  local: {
    target: {
      url: 'bolt://localhost:7687',
      user: '',
      password: '',
    },
  },
};

const createProjects = async (session, project) => {
  await session.writeTransaction((tx) => {
    tx.run(
        `
      CREATE (project:Project)
      SET project.label = $label,
          project.code = $code
    `,
        {
          label: project.label,
          code: project.code,
        },
    );
  });
};

const main = async () => {
  for (let key of Object.keys(datasources)) {
    const target = datasources[key].target;
    const driver = Neo4jClient.driver(
        target.url,
        Neo4jClient.auth.basic(target.user, target.password),
    );
    const session = driver.session();

    const project = {
      label: 'How to build laminate flooring ?',
      code: '1',
    };

    await createProjects(session, project);

    session.close();
    console.log('done!');
  }
};

main()
    .then(() => {
      process.exit(0);
    })
    .catch((e) => {
      console.error('An error occured', e);
      process.exit(1);
    });
