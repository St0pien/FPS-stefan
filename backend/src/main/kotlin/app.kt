import spark.kotlin.*
import spark.Spark.*
import com.google.gson.Gson
import controllers.LevelEditor
import models.Level
import models.LevelItem

fun main(args: Array<String>) {
    spark.kotlin.staticFiles.location("/public")
    spark.kotlin.port(3000)

    before() {
        response.header("Access-Control-Allow-Origin", "http://localhost:8080");
        response.header("Access-Control-Request-Method", "GET,POST,OPTIONS");
        response.header("Access-Control-Allow-Headers", "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version");
    }

    val levelEditor = LevelEditor()

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
