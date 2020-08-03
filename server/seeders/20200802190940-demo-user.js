module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Leaderboards', [
            {
                campaign: 'Summer 2020',
                map: 'XJ_JEjWGoAexDWe8qfaOjEcq5l8',
                data: JSON.stringify([
                    {
                        accountId: 'a9cbdeff-daa3-4bc2-998c-b2838183fb97',
                        zoneId: '30229617-7e13-11e8-8060-e284abfd2bc4',
                        zoneName: 'Vaud',
                        position: 1,
                        score: 19454,
                        name: 'AffiTM',
                    },
                    {
                        accountId: '531a9861-c024-4063-9b29-14601350b899',
                        zoneId: '301e4b33-7e13-11e8-8060-e284abfd2bc4',
                        zoneName: 'Lower Austria',
                        position: 2,
                        score: 19481,
                        name: 'Rollin.9D',
                    },
                    {
                        accountId: '2ed0997d-62bc-4a53-8c09-ffb793382ea2',
                        zoneId: '30201200-7e13-11e8-8060-e284abfd2bc4',
                        zoneName: 'Dortmund',
                        position: 3,
                        score: 19547,
                        name: 'riolu-tm',
                    },
                    {
                        accountId: 'a5af97bc-d185-404f-a7d1-5c4e48d05db6',
                        zoneId: '30222b92-7e13-11e8-8060-e284abfd2bc4',
                        zoneName: 'Wielkopolskie',
                        position: 4,
                        score: 19553,
                        name: 'RotakeR.9D',
                    },
                    {
                        accountId: 'dc512a57-42b5-411d-b798-ed1961c4fac3',
                        zoneId: '30200b48-7e13-11e8-8060-e284abfd2bc4',
                        zoneName: 'Hannover',
                        position: 5,
                        score: 19558,
                        name: 'LeGSimi',
                    },
                    {
                        accountId: '58278714-fbe5-4bb1-960c-3ad278bb7ecc',
                        zoneId: '301ff7e1-7e13-11e8-8060-e284abfd2bc4',
                        zoneName: 'Karlsruhe',
                        position: 6,
                        score: 19566,
                        name: 'styx-tm',
                    },
                    {
                        accountId: 'e2630e0a-72f9-4b47-8cb4-15a2abfad1df',
                        zoneId: '301f6969-7e13-11e8-8060-e284abfd2bc4',
                        zoneName: 'Isère',
                        position: 7,
                        score: 19568,
                        name: 'SapiTM',
                    },
                    {
                        accountId: 'aa4e375f-d23e-4915-8d53-8b3307e06764',
                        zoneId: '301ffccb-7e13-11e8-8060-e284abfd2bc4',
                        zoneName: 'Nürnberg',
                        position: 8,
                        score: 19568,
                        name: 'racehansTM',
                    },
                    {
                        accountId: 'b14f7613-8fb9-463e-b356-75f0700048db',
                        zoneId: '301f96de-7e13-11e8-8060-e284abfd2bc4',
                        zoneName: 'Ille-et-Vilaine',
                        position: 9,
                        score: 19576,
                        name: 'Canon-TM',
                    },
                    {
                        accountId: 'b67bedd1-7d2f-4861-86c4-dae8c1583ace',
                        zoneId: '30200bd1-7e13-11e8-8060-e284abfd2bc4',
                        zoneName: 'Oldenburg',
                        position: 10,
                        score: 19578,
                        name: 'Toasti9801',
                    },
                ]),

                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ])
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {})
    },
}
