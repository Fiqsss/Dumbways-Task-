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
    const blogs = [];

    // Membuat 5 data blog menggunakan loop
    for (let i = 1; i <= 5; i++) {
      blogs.push({
        title: `Blog ke-${i}`,
        content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus lorem ipsum, auctor quis risus nec, euismod fringilla sem. Phasellus congue, lectus sit amet lobortis maximus, nisi augue laoreet leo, non fermentum diam felis id libero. Vivamus elit elit, fringilla eu scelerisque quis, fermentum non felis. Nullam vel lorem eget mauris porta posuere. Suspendisse potenti. Sed at pretium libero. Sed eu augue dapibus arcu viverra semper. Aliquam gravida sapien at ante lobortis, ut scelerisque nisl venenatis. Integer orci mauris, egestas sed lacus nec, pretium aliquam risus. Cras id metus tellus.`,
        image: `${i}.jpg`,
        post_date: new Date(),
      });
    }
    await queryInterface.bulkInsert("blogs", blogs, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("blogs", null, {});
  },
};
