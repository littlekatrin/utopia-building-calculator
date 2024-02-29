// kN: This is a modified version of the original building.js file.
let buildings = null;
let totalLand = null;
let shouldTriggerOnChange = false;
const localStorageId = "UTBuilds"

function loadBuild(buildName) {
    let json = localStorage.getItem(localStorageId);
    if(json !== null) {
        let savedBuilds = JSON.parse(json);
        savedBuilds.selectedBuild = buildName
        localStorage.setItem(localStorageId, JSON.stringify(savedBuilds));
        let index = savedBuilds.allBuilds.findIndex(build => build.name === buildName);
        savedBuilds.allBuilds[index].buildList.forEach((build) => {
            let inputId = "#input_" + build.id;
            $(inputId).val(build.percent).trigger("input");
        });
    }
}

function saveBuild(name, buildList) {
    console.log("saveBuild");
    let jsonBuilds = localStorage.getItem(localStorageId);
    let savedBuilds;

    if(jsonBuilds !== null) {
        savedBuilds = JSON.parse(jsonBuilds);
        let index = savedBuilds.allBuilds.findIndex(build => build.name === name);
        console.log(index);
        if(index >= 0) {
            savedBuilds.allBuilds[index] = { name: name, buildList: buildList };
        } else {
            savedBuilds.allBuilds.push({ name: name, buildList: buildList });
        }
    } else {
        savedBuilds = { selectedBuild: name, allBuilds: [] }
        savedBuilds.allBuilds.push({ name: name, buildList: buildList });
    }

    savedBuilds.selectedBuild = name;

    let json = JSON.stringify(savedBuilds);
    localStorage.setItem(localStorageId, json);
    setupBuildDropdown()
}

function deleteBuild(name) {
    console.log(name);
    console.log("deleteBuild");
    let jsonBuilds = localStorage.getItem(localStorageId);

    if(jsonBuilds !== null) {
        let savedBuilds = JSON.parse(jsonBuilds);
        let index = savedBuilds.allBuilds.findIndex(build => build.name === name);
        if(index >= 0 && name !== "current") {
            savedBuilds.allBuilds.splice(index, 1)
            savedBuilds.selectedBuild = "current"
            let json = JSON.stringify(savedBuilds);
            localStorage.setItem(localStorageId, json);
            setupBuildDropdown()
        }
    }
}

function setupBuildDropdown() {
    console.log("setupBuildDropdown");
    let buildDropDown = $("#build_select");
    buildDropDown.empty();
    let jsonBuilds = localStorage.getItem(localStorageId);
    let savedBuilds = JSON.parse(jsonBuilds);

    savedBuilds.allBuilds.forEach((build) => {
        let option = new Option(build.name, build.name)
        buildDropDown.append($(option));
    });

    buildDropDown.val(savedBuilds.selectedBuild).change();
}

function saveCurrentBuild(name) {
    let buildList = [];
    $("#buildtool td").each(function() {
        let tdid = $(this).attr("id")
        if(tdid !== undefined) {
            let id = tdid.replace("id_", "");
            let inputId = "#input_" + id;
            let percent = $(inputId).val();
            buildList.push(
                { id: id, percent: percent }
            )
        }
    });
    saveBuild(name, buildList)
}

function updateTotalPercent(knBuildingObject) {
    let total = 0;
    $("#buildtool td").each(function() {
            let tdid = $(this).attr("id");
            if(tdid !== undefined) {
                let id = tdid.replace("id_", "");
                total += parseFloat($("#input_" + id).val() || 0);
            }
        });
    $("#growth_total").html("Total " + total.toFixed(1) + "%");
    if (knBuildingObject) {
        $("#growth_total_gc").html(`Total Cost ${_updateCosts(knBuildingObject).toLocaleString()}  gc`);
        $("#growth_total_gc").show();
    } else {
        $("#growth_total_gc").html(`Total Cost 0  gc`);
        $("#growth_total_gc").hide();
    }
}

/**
 * Update the costs of all projected buildings
 * @returns {number}
 * @param knBuildingObject {Object}
 * @private
 */
function _updateCosts(buildingObject) {
    if (!buildingObject) {
        return 0;
    }
    let netCost = 0;

    buildingObject.buildingList.forEach((building) => {
        let cost = 0;
        if (building.toBuild > 0) {
            cost += buildingObject.buildCost * building.toBuild;
            console.log(`(${building.toBuild}) ${building.name} build cost: ${cost} gc`);
        } else if (building.toBuild < 0) {
            cost += Math.abs(buildingObject.razeCost * building.toBuild);
            console.log(`(${building.toBuild}) ${building.name} raze cost: ${cost} gc`);
        }
        netCost += cost;
    });
    console.log(`Total Construction Cost: ${netCost} gc`);
    return netCost;
}

$(document).ready(function() {
    let building_json = $("#growth_buildings").val();
    buildings = JSON.parse(building_json);
    totalLand = parseInt($("#growth_total_land").val());

    /** Modify the buildings object to include the cost of building and razing
     * and to include the number of net building to be done +/- (toBuild)
     * @author kN
    */
    const _buildCost = $('#build_cost_gc').text();
    const _razeCost = $('#raze_cost_gc').text();
    buildings.forEach((building) => {
        building.toBuild = 0;
    });
    const knBuildingObject = {
        buildCost: _buildCost,
        razeCost: _razeCost,
        buildingList: Array.from(buildings),
    };
    console.log('knBuildingObject', knBuildingObject);

    buildings.forEach((building) => {
        let inputId = "#input_" + building.buildingId;
        let totalCurrent = building.quantityScheduled + building.quantityOwned;
        let totalPercent = (totalCurrent / totalLand) * 100;
        if(totalPercent !== 0) { totalPercent = totalPercent.toFixed(1) }

        $(inputId).val(totalPercent);
        updateTotalPercent()
    });

    $("#build_select").on("change", function () {
        console.log("DropDown CHANGE");
        loadBuild($("#build_select").val());
    });

    $("#growth_fill_in").on('click', function() {
        $("#buildtool td").each(function() {
            let tdid = $(this).attr("id");
            if(tdid !== undefined) {
                let type = $("#growth_type").val();
                let id = tdid.replace("id_", "");
                let buildingInfo = buildings.find(build => build.buildingId === parseInt(id));
                let toBuild = $("#build_" + id).html();
                let buildInput = $("#id_quantity_" + buildingInfo.buildingId);


                if(type === 'build') {
                    if (toBuild > 0) {
                        buildInput.val(toBuild);
                    } else {
                        buildInput.val("");
                    }
                }

                if(type === 'raze') {
                    let maxRaze = buildingInfo.quantityOwned;
                    let toRaze = toBuild * -1;
                    if(toRaze > 0 && maxRaze > 0) {
                        if(maxRaze > toRaze) {
                            buildInput.val(Math.abs(toRaze))
                        } else {
                            buildInput.val(maxRaze)
                        }
                    } else {
                        buildInput.val("")
                    }
                }

                if(type === 'cancel') {
                    let maxCancel = buildingInfo.quantityScheduled;
                    let toCancel = Math.abs(toBuild)
                    if(toCancel > 0 && maxCancel > 0) {
                        if(maxCancel > toCancel) {
                            buildInput.val(toCancel)
                        } else {
                            buildInput.val(maxCancel)
                        }
                    } else {
                        buildInput.val("")
                    }
                }
            }
        });
    });

    $("#growth_save").on('click', function() {
        let row = $("#row_build_name");
        if(row.is(':visible')) {
            row.hide()
        } else {
            row.show();
        }
    });

    $("#growth_delete").on('click', function() {
        deleteBuild($("#build_select").val());
    });

    $("#growth_save_to_local").on('click', function() {
        let input = $("#input_build_name")
        let buildName = input.val();
        saveCurrentBuild(buildName, true);
        input.val("");
        $("#row_build_name").hide();
    });

    $("#buildtool td").each(function() {
        let tdid = $(this).attr("id")
        if(tdid !== undefined) {
            let id = tdid.replace("id_", "");
            let divId = "#build_" + id;
            let costDivId = "#build_gc_" + id;
            let inputId = "#input_" + id;

            $(inputId).on('input', function() {
                let buildingInfo = buildings.find(build => build.buildingId === parseInt(id));                
                let totalCurrent = buildingInfo.quantityScheduled + buildingInfo.quantityOwned;
                let div = $(divId);

                let percent = $(this).val();
                let total = Math.round(totalLand * (percent / 100));
                let toBuild = total - totalCurrent
                // kN: Keeping this up to date
                buildingInfo.toBuild = toBuild;

                div.html(toBuild);
                let color = 'grey';
                $(costDivId).html(0);
                if (toBuild > 0) { 
                    color = 'green';
                    $(costDivId).html(toBuild * knBuildingObject.buildCost)
                } else if (toBuild < 0) { 
                    color = 'red';
                    $(costDivId).html(Math.abs(toBuild * knBuildingObject.razeCost))
                }
                div.css('background-color', color);
                updateTotalPercent(knBuildingObject);
            });
        }
    });

    if(
        document.referrer.includes("raze") ||
        document.referrer.includes("cancel") ||
        document.referrer.includes("build")
    ) { setupBuildDropdown() } else { saveCurrentBuild("current") }
    });