import com.google.gson.Gson
import controllers.LevelEditor
import models.GameResult
import models.Level
import models.LevelItem
import spark.Spark.*
import spark.kotlin.*
import java.sql.DriverManager

fun getPort(): Int {
    val processBuilder = ProcessBuilder()
    return if (processBuilder.environment()["PORT"] != null) {
        processBuilder.environment()["PORT"]!!.toInt()
    } else 5000
}

fun main(args: Array<String>) {
    spark.kotlin.staticFiles.location("/public")
    spark.kotlin.port(getPort())

    before() {
        response.header("Access-Control-Allow-Origin", "http://localhost:8080");
        response.header("Access-Control-Request-Method", "GET,POST,OPTIONS");
        response.header("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
    }

    options("/*") {
        "OK"
    }

    val levelEditor = LevelEditor()
    val conn = DriverManager.getConnection("jdbc:postgresql://localhost:5432/FPS", "postgres", "system")

    get("/game") {
        response.redirect("/game/")
    }

    path("/api") {
        post("/result", "application/json") {
            val gameResult = Gson().fromJson(request.body(), GameResult::class.java)
            val stmt = conn.createStatement()
            val result = stmt.executeUpdate("INSERT INTO games (killedenemies, gamewon) values (${gameResult.killedEnemies}, ${gameResult.gameWon})")
            "Ok"
        }
    }

    path("/editor") {
        get("") {
            response.redirect("/editor/")
        }

        get("/load") {
            response.type("application/json")
            Gson().toJson(levelEditor.getLevelItems())
        }

        post("/add", "application/json") {
            val levelItems: Array<LevelItem> = Gson().fromJson(request.body(), Array<LevelItem>::class.java) ?: arrayOf<LevelItem>()
            levelEditor.setLevel(Level(10, mutableListOf(*levelItems)))
            "Saved!"
        }
    }
}
