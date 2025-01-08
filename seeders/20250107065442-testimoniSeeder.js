"use strict";

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
    let author = ["fahmi", "reza", "rini", "intan", "joko", "joni", "sinta"];
    const testimonis = [];
    for (let i = 0; i < 5; i++) {
      testimonis.push({
        author: author[i % author.length],
        rating: Math.floor(Math.random() * 5) + 1,
        testimoni: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque, nobis culpa? Error, sequi adipisci voluptatem expedita dicta vel aspernatur harum`,
        image: `1.png`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    await queryInterface.bulkInsert("testimonis", testimonis, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("testimonis", null, {});
  },
};
