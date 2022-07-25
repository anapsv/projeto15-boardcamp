import connection from "../dbStrategy/database.js";

export async function loadCategories(req, res) {
  try {
    const { rows: categories } = await connection.query(
      "SELECT * FROM categories;"
    );
    res.send(categories); //lista de todas as categorias
  } catch {
    res.sendStatus(500);
  }
}

export async function addNewCategory(req, res) {
  const { name } = req.body;

  try {
    const { rows: categoryExists } = await connection.query(
      "SELECT * FROM categories WHERE name = $1;",
      [name]
    );

    if (name.length === 0) {
      console.log('O nome da categoria não pode estar vazio!');
      return res.sendStatus(400); //name não pode estar vazio ⇒ nesse caso, deve retornar status 400
    }

    if (categoryExists.length !== 0) {
      console.log('Categoria já existente!');
      return res.sendStatus(409); //name não pode ser um nome de categoria já existente ⇒ nesse caso deve retornar status 409
    }

    await connection.query("INSERT INTO categories (name) VALUES ($1);", [name]);

    res.sendStatus(201); //status 201, sem dados
  } catch {
    res.sendStatus(500);
  }
}