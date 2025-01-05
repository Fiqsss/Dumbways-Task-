"use strict";

const { query } = require("express");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    const projects = [];
    for (let i = 1; i <= 4; i++) {
      const startMonth = i - 1;
      const endMonth = startMonth + 2;

      projects.push({
        projectname: `Project ke-${i}`,
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus lorem ipsum, auctor quis risus nec, euismod fringilla sem. Phasellus congue, lectus sit amet lobortis maximus, nisi augue laoreet leo, non fermentum diam felis id libero. Vivamus elit elit, fringilla eu scelerisque quis, fermentum non felis. Nullam vel lorem eget mauris porta posuere. Suspendisse potenti. Sed at pretium libero. Sed eu augue dapibus arcu viverra semper. Aliquam gravida sapien at ante lobortis, ut scelerisque nisl venenatis. Integer orci mauris, egestas sed lacus nec, pretium aliquam risus. Cras id metus tellus.`,
        startdate: new Date(2024, startMonth, i),
        enddate: new Date(2024, endMonth, i),
        technologies: ["Node.js", "React.js", "Next.js", "TypeScript"],
        image: `${i}.jpg`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await queryInterface.bulkInsert("projects", projects, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("projects", null, {});
  },
};
