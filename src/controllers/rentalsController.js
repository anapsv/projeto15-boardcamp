import connection from "../dbStrategy/database.js";
import dayjs from "dayjs";

export async function loadRentals(req, res) {
  const { customerId, gameId, offset, limit, order } = req.query;
  let paramsQuery = '';
  let orderQuery = '';
  let offsetQuery = '';
  let limitQuery = '';

  try {
    customerId
      ? (paramsQuery = `WHERE rentals."customerId" = ${customerId}`)
      : "";
    gameId ? (paramsQuery = `WHERE rentals."gameId" = ${gameId}`) : "";
    order ? (orderQuery = `ORDER BY "${order}" ASC`) : "";
    offset ? (offsetQuery = `OFFSET ${offset}`) : "";
    limit ? (limitQuery = `LIMIT ${limit}`) : "";

    const { rows: rentals } = await connection.query(
      `
        SELECT 
            rentals.*, 
            to_json(customers) "customer", 
            to_json(games) "game"
        FROM rentals 
            INNER JOIN customers ON customers.id = rentals."customerId" 
            INNER JOIN (SELECT 
                    games.*, 
                    categories.name as "categoryName" 
                FROM games 
                    JOIN categories ON games."categoryId" = categories.id) 
                AS games
            ON games.id = rentals."gameId" 
        ${paramsQuery}
        ${orderQuery}
        ${offsetQuery}
        ${limitQuery}
           ;
        `
    );
    if (rentals.length !== 0) {
      delete rentals[0].customer.phone;
      delete rentals[0].customer.cpf;
      delete rentals[0].customer.birthday;
      delete rentals[0].game.image;
      delete rentals[0].game.stockTotal;
      delete rentals[0].game.pricePerDay;
    }

    return res.send(rentals); //lista com todos os aluguéis, contendo o customer e o game do aluguel em questão em cada aluguel

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function addNewRental(req, res) {
  try {
    const { customerId, gameId, daysRented } = req.body;

    const returnDate = null;
    const delayFee = null;
    const rentDate = dayjs().format("YYYY-MM-DD");

    const { rows: games } = await connection.query(
      `SELECT * FROM games WHERE id = ${gameId};`
    );

    const originalPrice = daysRented * games[0].pricePerDay;

    const { rows: rentalsGame } = await connection.query(
      `SELECT * FROM rentals WHERE "gameId" = $1;`,
      [gameId]
    );

    if (rentalsGame.length + 1 > games[0].stockTotal) {
      console.log(rentalsGame.length);
      console.log(games[0].stockTotal);
      console.log('Não há jogos disponíveis no estoque!');

      return res.sendStatus(400);

    }
    console.log(rentalsGame.length + 1);
    console.log(games[0].stockTotal);

    await connection.query(
      `INSERT INTO rentals (
          "customerId", 
          "gameId", 
          "daysRented", 
          "returnDate", 
          "delayFee",
          "rentDate", 
          "originalPrice") 
        VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [
        customerId,
        gameId,
        daysRented,
        returnDate,
        delayFee,
        rentDate,
        originalPrice,
      ]
    );

    res.sendStatus(201);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    await connection.query(`DELETE FROM rentals WHERE id = $1`, [id]);

    res.sendStatus(200);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function returnRental(req, res) {
  const { id } = req.params;

  try {
    const returnDate = dayjs().format("YYYY-MM-DD");
    const dayNow = dayjs(returnDate);
    let delayFee = 0;

    const { rows: rentals } = await connection.query(
      `SELECT * FROM rentals WHERE id = $1`,
      [id]
    );
    const { rentDate, daysRented, gameId } = rentals[0];

    const { rows: game } = await connection.query(
      `SELECT * FROM games WHERE id = ${gameId};`
    );
    const { pricePerDay } = game[0];

    const delayDays = dayNow.diff(rentDate, "days");

    if (delayDays > daysRented) {
      const delayDaysFee = delayDays - daysRented;
      delayFee = delayDaysFee * pricePerDay;
    }

    await connection.query(
      `UPDATE rentals SET "returnDate" = $1, "delayFee" = $2 WHERE id = $3;`,
      [returnDate, delayFee, id]
    );

    res.sendStatus(200);

  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}