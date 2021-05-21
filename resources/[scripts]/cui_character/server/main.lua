local function getPlayerLicense(source)
    for k,v in ipairs(GetPlayerIdentifiers(source)) do
        if string.match(v, 'license:') then
            return string.sub(v, 9)
        end
    end
    return false
end

-- Create the database table if it does not exist
MySQL.ready(function()
    MySQL.Async.execute('CREATE TABLE IF NOT EXISTS `player_skins` (`id` int(11) NOT NULL auto_increment, `identifier` varchar(128) NOT NULL, `skin` LONGTEXT NULL DEFAULT NULL, PRIMARY KEY  (`id`), UNIQUE(`identifier`))',{}, 
    function() end)
end)

RegisterServerEvent('cui_character:save')
AddEventHandler('cui_character:save', function(data)
    local _source = source
    local license = getPlayerLicense(_source)

    if license then
        MySQL.ready(function()
            MySQL.Async.execute('INSERT INTO `player_skins` (`identifier`, `skin`) VALUES (@identifier, @skin) ON DUPLICATE KEY UPDATE `skin` = @skin', {
                ['@skin'] = json.encode(data),
                ['@identifier'] = license
            })
        end)
    end
end)

RegisterServerEvent('cui_character:requestPlayerData')
AddEventHandler('cui_character:requestPlayerData', function()
    local _source = source
    local license = getPlayerLicense(_source)

    if license then
        MySQL.ready(function()
            MySQL.Async.fetchAll('SELECT skin FROM player_skins WHERE identifier = @identifier', {
                ['@identifier'] = license
            }, function(users)
                local playerData = { skin = nil, newPlayer = true}
                if users and users[1] ~= nil and users[1].skin ~= nil then
                    playerData.skin = json.decode(users[1].skin)
                    playerData.newPlayer = false
                end
                TriggerClientEvent('cui_character:recievePlayerData', _source, playerData)
            end)
        end)
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