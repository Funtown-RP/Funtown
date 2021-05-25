-- Create the database table if it does not exist
-- MySQL.ready(function()
--     MySQL.Async.execute('CREATE TABLE IF NOT EXISTS `player_skins` (`id` int(11) NOT NULL auto_increment, `identifier` varchar(128) NOT NULL, `skin` LONGTEXT NULL DEFAULT NULL, PRIMARY KEY  (`id`), UNIQUE(`identifier`))',{}, 
--     function() end)
-- end)

RegisterServerEvent('cui_character:save')
AddEventHandler('cui_character:save', function(char, data)
    local _source = source

    if char then
        MySQL.ready(function()
            MySQL.Async.execute('INSERT INTO `player_skins` (`char_id`, `skin`) VALUES (@charID, @skin) ON DUPLICATE KEY UPDATE `skin` = @skin', {
                ['@skin'] = json.encode(data),
                ['@charID'] = char.id
            })
        end)
    end
end)

RegisterServerEvent('cui_character:requestCharData')
AddEventHandler('cui_character:requestCharData', function(char, newPlayer)
    local src = source

    if not newPlayer then
        MySQL.ready(function()
            MySQL.Async.fetchAll('SELECT skin FROM player_skins WHERE char_id = @charID', {
                ['@charID'] = char.id
            }, function(users)
                local playerData = { skin = nil, newPlayer = true}
                if users and users[1] ~= nil and users[1].skin ~= nil then
                    playerData.skin = json.decode(users[1].skin)
                    playerData.newPlayer = false
                end
                TriggerClientEvent('cui_character:recievePlayerData', src, playerData)
            end)
        end)
    else
        local playerData = { skin = nil, newPlayer = true}
        TriggerClientEvent('cui_character:recievePlayerData', src, playerData)
    end
end)

RegisterCommand("identity", function(source, args, rawCommand)
    if (source > 0) then
        TriggerClientEvent('cui_character:open', source, { 'identity', 'features', 'style', 'apparel' })
    end
end, false)

RegisterCommand("character", function(source, args, rawCommand)
    if (source > 0) then
        TriggerClientEvent('cui_character:open', source, { 'features', 'style', 'apparel' })
    end
end, false)

RegisterCommand("features", function(source, args, rawCommand)
    if (source > 0) then
        TriggerClientEvent('cui_character:open', source, { 'features' })
    end
end, false)

RegisterCommand("style", function(source, args, rawCommand)
    if (source > 0) then
        TriggerClientEvent('cui_character:open', source, { 'style' })
    end
end, false)

RegisterCommand("apparel", function(source, args, rawCommand)
    if (source > 0) then
        TriggerClientEvent('cui_character:open', source, { 'apparel' })
    end
end, false)