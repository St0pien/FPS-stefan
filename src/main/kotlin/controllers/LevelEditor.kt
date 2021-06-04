package controllers

import models.Level
import models.LevelItem

class LevelEditor() : LevelEditorService {
    private lateinit var level: Level

    override fun setLevel(level: Level) {
        this.level = level
    }

    override fun getLevel(): Level {
        return level
    }

    override fun getLevelItems(): Array<LevelItem> {
        return if(this::level.isInitialized) level.list.toTypedArray() else arrayOf()
    }
}