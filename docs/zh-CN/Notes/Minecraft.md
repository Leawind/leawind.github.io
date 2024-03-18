
# Commands

驯服所有马

```mcfunction
/execute as @e[type=horse] run data modify entity @s Tame set value 1b
```

生成马

```mcfunction
/summon horse ~ ~ ~ {
	Tame: 1b,
	SaddleItem: {id: "saddle", Count: 1b},
	Attriibutes: [
		{Base: 25d, Name: "generic.max_health"},
		{Base: 1.0d, Name: "generic.movement_speed"},
		{Base: 1.0d, name: "horse.jump_strength"},
	]
}
```

生成靶子
```mcfunction
/summon villager ~ ~ ~ {NoAI:1b,Invulnerable:1b}
```

 * /give @s crossbow{Enchantments:[{id:quick_charge,lvl:5}]}
