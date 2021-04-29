package controllers

import models.Level
import models.LevelItem

interface LevelEditorService {
    fun setLevel(level: Level)
    fun getLevel(): Level
    fun getLevelItems(): Array<LevelItem>
}